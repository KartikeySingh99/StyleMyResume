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
const MODELS_URL = "https://generativelanguage.googleapis.com/v1beta/models";

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

    const model = normalizeModel(process.env.GEMINI_MODEL);

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    // Header rather than ?key= so the secret stays out of URLs and logs.
                    "x-goog-api-key": apiKey,
                },
                body: JSON.stringify(buildRequestBody(section, data)),
            }
        );

        if (!response.ok) {
            const detail = await response.text();
            console.error(`Gemini ${response.status} for model "${model}": ${detail.slice(0, 500)}`);

            if (response.status === 429) {
                return json({ error: "Too many requests right now. Please try again in a minute." }, 429);
            }
            if (response.status === 404) {
                // Don't assert a cause — report what Google said and what this key
                // can actually use, so the next step is obvious.
                const usable = await listUsableModels(apiKey);
                const options = usable.filter((name) => name.includes("flash")).slice(0, 5);
                return json(
                    {
                        error:
                            `Gemini rejected model "${model}" (404). ` +
                            (options.length
                                ? `Models available to this key include: ${options.join(", ")}. Set GEMINI_MODEL to one of them.`
                                : `This key returned no usable models — check that it is valid and the Generative Language API is enabled.`),
                        detail: detail.slice(0, 300),
                    },
                    502
                );
            }
            if (response.status === 400 || response.status === 403) {
                return json({ error: "Suggestions are misconfigured. Check the API key." }, 502);
            }
            return json({ error: "Could not generate suggestions. Please try again." }, 502);
        }

        const result = extractSuggestions(await response.json());
        if (result.error) return json({ error: result.error }, 502);

        console.log(`Generated ${result.suggestions.length} suggestions for user ${userId} (${section}).`);
        return json({ section, suggestions: result.suggestions });
    } catch (error) {
        console.error(`Gemini request failed: ${error?.message ?? error}`);
        return json({ error: "Could not generate suggestions. Please try again." }, 502);
    }
};
