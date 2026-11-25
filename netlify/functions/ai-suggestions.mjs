/**
 * Resume suggestions endpoint. Served at /.netlify/functions/ai-suggestions
 *
 * Lives here rather than in client code so the Gemini key never reaches the
 * browser — every VITE_* variable is inlined into the public bundle.
 *
 * Because a Netlify function is a public URL, the caller must present an
 * Appwrite JWT, which is verified against Appwrite before Gemini is called.
 * Without that, anyone could burn the project's Gemini quota.
 *
 * Zero npm dependencies: Appwrite verification and Gemini both over fetch.
 */

const ALLOWED_SECTIONS = ["experience", "project", "education", "skills", "personalDetails"];
const MAX_INPUT_CHARS = 6000;
// Floating alias rather than a pinned version, so it does not rot as Google
// retires model versions.
const DEFAULT_MODEL = "gemini-flash-latest";
// Also an alias, deliberately. Pinned versions get retired or restricted to
// existing users (gemini-2.5-flash now 404s for new keys), so pinning a
// fallback just guarantees a second failure.
const DEFAULT_FALLBACK_MODEL = "gemini-flash-lite-latest";

// Models that cannot do resume text, so they are never worth suggesting.
const NON_TEXT_MODEL = /tts|image|embedding|transcribe|audio|banana|lyria|robotics|computer-use|veo/i;
const MODELS_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// Gemini returns 503 UNAVAILABLE under load and says the spike is temporary, so
// a few quick retries beat surfacing a failure on the first attempt. Kept well
// inside Netlify's synchronous function budget.
const RETRYABLE_STATUSES = new Set([500, 502, 503, 504]);
const BACKOFF_MS = [400, 1200];

const SYSTEM_PROMPT = `You are a technical recruiter reviewing a student or early-career resume section.
Reply with 4-6 short, specific, actionable improvements.
Rules:
- One suggestion per line, each starting with "- ".
- Point at the actual wording supplied; never invent achievements.
- Prefer concrete advice: quantify impact, lead with strong action verbs, cut filler, add missing tech/scope.
- No preamble, no closing summary, no markdown headings.`;

const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
    });

/**
 * Every failure carries the model, upstream status and Google's own body.
 * The client renders only `error`; the rest is for the Network tab and logs, so
 * a cause never has to be guessed at from a generic message again.
 */
const failure = (message, status, { model, status: upstream, detail } = {}) =>
    json(
        {
            error: message,
            ...(model ? { model } : {}),
            ...(upstream ? { upstreamStatus: upstream } : {}),
            ...(detail ? { detail: String(detail).slice(0, 500) } : {}),
        },
        status
    );

/** Pulls Google's human-readable message out of an error body, if there is one. */
export const geminiMessage = (body) => {
    try {
        const message = JSON.parse(body)?.error?.message;
        return message ? String(message) : null;
    } catch {
        return null;
    }
};

export const buildRequestBody = (section, data) => ({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [
        {
            role: "user",
            parts: [{ text: `Resume section: ${section}\n\n${String(data).slice(0, MAX_INPUT_CHARS)}` }],
        },
    ],
    generationConfig: { temperature: 0.4, maxOutputTokens: 700 },
});

/**
 * Pulls bullet lines out of a Gemini response.
 * Returns { suggestions } or { error } — a safety block or an empty candidate
 * must not surface as a crash.
 */
export const extractSuggestions = (payload) => {
    const blockReason = payload?.promptFeedback?.blockReason;
    if (blockReason) {
        return { error: `The request was blocked (${blockReason}). Try rewording this section.` };
    }

    const candidate = payload?.candidates?.[0];
    if (!candidate) return { error: "No suggestions came back. Please try again." };

    const text = (candidate.content?.parts ?? []).map((part) => part?.text ?? "").join("\n");

    if (!text.trim()) {
        const reason = candidate.finishReason;
        if (reason === "SAFETY" || reason === "PROHIBITED_CONTENT") {
            return { error: "The response was filtered. Try rewording this section." };
        }
        return { error: "No suggestions came back. Please try again." };
    }

    const suggestions = text
        .split("\n")
        .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
        .filter(Boolean);

    return suggestions.length
        ? { suggestions, truncated: candidate.finishReason === "MAX_TOKENS" }
        : { error: "No suggestions came back. Please try again." };
};

/** Tolerates a stray `models/` prefix or surrounding whitespace in config. */
export const normalizeModel = (value) =>
    String(value ?? "").trim().replace(/^models\//, "") || DEFAULT_MODEL;

/**
 * Models this key can actually use for generateContent. Only called to explain
 * a failure, so it must never throw or mask the original error.
 */
export const listUsableModels = async (apiKey, fetchImpl = fetch) => {
    try {
        const response = await fetchImpl(MODELS_URL, { headers: { "x-goog-api-key": apiKey } });
        if (!response.ok) return [];
        const { models } = await response.json();
        return (models ?? [])
            .filter((model) => (model.supportedGenerationMethods ?? []).includes("generateContent"))
            .map((model) => String(model.name ?? "").replace(/^models\//, ""))
            .filter(Boolean);
    } catch {
        return [];
    }
};

const defaultSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calls generateContent, retrying transient upstream failures and then falling
 * back to a second model. Returns the first non-retryable response along with
 * the model that produced it and how many requests were made.
 *
 * Retries only 5xx. A 400/403/404 is a real problem with the request and a 429
 * means quota — hammering either makes things worse.
 */
export const callGemini = async (
    { apiKey, models, body },
    { fetchImpl = fetch, sleep = defaultSleep } = {}
) => {
    let attempts = 0;
    let last = null;

    for (const model of models) {
        for (let tryIndex = 0; tryIndex < BACKOFF_MS.length + 1; tryIndex++) {
            attempts++;
            const response = await fetchImpl(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
                {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        // Header rather than ?key= so the secret stays out of URLs and logs.
                        "x-goog-api-key": apiKey,
                    },
                    body: JSON.stringify(body),
                }
            );

            last = { response, model, attempts };
            if (response.ok || !RETRYABLE_STATUSES.has(response.status)) return last;

            const delay = BACKOFF_MS[tryIndex];
            if (delay !== undefined) await sleep(delay);
        }
    }

    return last;
};

/** Resolves the Appwrite user behind a JWT, or null if it is not valid. */
export const resolveUser = async (jwt, { endpoint, projectId, fetchImpl = fetch }) => {
    if (!jwt || !endpoint || !projectId) return null;
    try {
        const response = await fetchImpl(`${endpoint.replace(/\/$/, "")}/account`, {
            headers: { "X-Appwrite-Project": projectId, "X-Appwrite-JWT": jwt },
        });
        if (!response.ok) return null;
        const account = await response.json();
        return account?.$id ?? null;
    } catch {
        return null;
    }
};

export default async (req) => {
    if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

    const apiKey = process.env.GEMINI_API_KEY;
    // Netlify passes every site variable to functions, so the values the web app
    // already uses are reused here. The VITE_ prefix only tells Vite a value is
    // safe to expose to the browser; these are public identifiers either way.
    const endpoint = process.env.APPWRITE_ENDPOINT || process.env.VITE_APPWRITE_URL;
    const projectId = process.env.APPWRITE_PROJECT_ID || process.env.VITE_APPWRITE_PROJECT_ID;

    if (!apiKey) {
        console.error("GEMINI_API_KEY is not set.");
        return json({ error: "Suggestions are not configured yet." }, 500);
    }
    if (!endpoint || !projectId) {
        console.error("No Appwrite endpoint/project in the environment — cannot verify callers.");
        return json({ error: "Suggestions are not configured yet." }, 500);
    }

    // Verify the caller before spending any quota.
    const userId = await resolveUser(req.headers.get("x-appwrite-jwt"), { endpoint, projectId });
    if (!userId) return json({ error: "You must be signed in to request suggestions." }, 401);

    let payload;
    try {
        payload = await req.json();
    } catch {
        return json({ error: "Invalid request body." }, 400);
    }

    const section = String(payload?.section ?? "").trim();
    const data = String(payload?.data ?? "").trim();

    if (!ALLOWED_SECTIONS.includes(section)) return json({ error: "Unsupported resume section." }, 400);
    if (!data) return json({ error: "Add some content to this section first." }, 400);

    const primary = normalizeModel(process.env.GEMINI_MODEL);
    const fallback = normalizeModel(process.env.GEMINI_FALLBACK_MODEL || DEFAULT_FALLBACK_MODEL);
    const candidates = fallback && fallback !== primary ? [primary, fallback] : [primary];

    let model = primary;

    try {
        const attempt = await callGemini({
            apiKey,
            models: candidates,
            body: buildRequestBody(section, data),
        });

        const { response, attempts } = attempt;
        model = attempt.model;

        if (!response.ok) {
            const detail = await response.text();
            console.error(
                `Gemini ${response.status} after ${attempts} request(s), last model "${model}": ${detail.slice(0, 1000)}`
            );

            if (RETRYABLE_STATUSES.has(response.status)) {
                // Already retried and fell back; the upstream is genuinely busy.
                return failure(
                    "Gemini is busy right now. Please try again in a moment.",
                    503,
                    { model, status: response.status, detail }
                );
            }

            if (response.status === 429) {
                return failure("Too many requests right now. Please try again in a minute.", 429, {
                    model,
                    status: response.status,
                    detail,
                });
            }

            if (response.status === 404) {
                // Google's own message is the useful part here — a 404 usually means
                // the model was retired or restricted to existing users, and the
                // message names the replacement to migrate to.
                const upstreamMessage = geminiMessage(detail);
                const usable = await listUsableModels(apiKey);
                const options = usable.filter((name) => !NON_TEXT_MODEL.test(name)).slice(0, 5);

                return failure(
                    `Gemini rejected model "${model}" (404). ` +
                        (upstreamMessage ? `${upstreamMessage} ` : "") +
                        (options.length
                            ? `Usable text models for this key: ${options.join(", ")}. Set GEMINI_MODEL to one of them.`
                            : `This key returned no usable models — check that it is valid and the Generative Language API is enabled.`),
                    502,
                    { model, status: response.status, detail }
                );
            }

            // Everything else: Google's own message is the useful part, so pass it
            // through rather than replacing it with advice that may be wrong.
            return failure(geminiMessage(detail) ?? "Could not generate suggestions. Please try again.", 502, {
                model,
                status: response.status,
                detail,
            });
        }

        const result = extractSuggestions(await response.json());
        if (result.error) return failure(result.error, 502, { model });

        console.log(`Generated ${result.suggestions.length} suggestions for user ${userId} (${section}).`);
        return json({ section, suggestions: result.suggestions });
    } catch (error) {
        console.error(`Gemini request failed for model "${model}": ${error?.stack ?? error}`);
        return failure("Could not reach Gemini. Please try again.", 502, {
            model,
            detail: String(error?.message ?? error),
        });
    }
};
