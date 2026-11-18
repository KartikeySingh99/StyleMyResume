const ALLOWED_SECTIONS = ["experience", "project", "education", "skills", "personalDetails"];
const MAX_INPUT_CHARS = 6000;
const DEFAULT_MODEL = "gemini-2.5-flash";

const SYSTEM_PROMPT = `You are a technical recruiter reviewing a student or early-career resume section.
Reply with 4-6 short, specific, actionable improvements.
Rules:
- One suggestion per line, each starting with "- ".
- Point at the actual wording supplied; never invent achievements.
- Prefer concrete advice: quantify impact, lead with strong action verbs, cut filler, add missing tech/scope.
- No preamble, no closing summary, no markdown headings.`;

const endpointFor = (model) =>
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

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

    const text = (candidate.content?.parts ?? [])
        .map((part) => part?.text ?? "")
        .join("\n");

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

export default async ({ req, res, log, error }) => {
    // Appwrite sets this header for executions triggered by a logged-in client.
    const userId = req.headers["x-appwrite-user-id"];
    if (!userId) {
        return res.json({ error: "You must be signed in to request suggestions." }, 401);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        error("GEMINI_API_KEY is not configured on the function.");
        return res.json({ error: "Suggestions are not configured yet." }, 500);
    }

    const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

    let payload;
    try {
        payload = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body ?? {};
    } catch {
        return res.json({ error: "Invalid request body." }, 400);
    }

    const section = String(payload.section ?? "").trim();
    const data = String(payload.data ?? "").trim();

    if (!ALLOWED_SECTIONS.includes(section)) {
        return res.json({ error: "Unsupported resume section." }, 400);
    }
    if (!data) {
        return res.json({ error: "Add some content to this section first." }, 400);
    }

    try {
        const response = await fetch(endpointFor(model), {
            method: "POST",
            headers: {
                "content-type": "application/json",
                // Header rather than ?key= so the secret stays out of URLs and logs.
                "x-goog-api-key": apiKey,
            },
            body: JSON.stringify(buildRequestBody(section, data)),
        });

        if (!response.ok) {
            const detail = await response.text();
            error(`Gemini ${response.status} for model "${model}": ${detail.slice(0, 500)}`);

            if (response.status === 429) {
                return res.json(
                    { error: "Too many requests right now. Please try again in a minute." },
                    429
                );
            }
            if (response.status === 404) {
                // Model names change; make this unambiguous rather than generic.
                return res.json(
                    {
                        error:
                            `Model "${model}" is not available for this key. Set the GEMINI_MODEL ` +
                            `function variable to a model your key can use.`,
                    },
                    502
                );
            }
            if (response.status === 400 || response.status === 403) {
                return res.json({ error: "Suggestions are misconfigured. Check the API key." }, 502);
            }
            return res.json({ error: "Could not generate suggestions. Please try again." }, 502);
        }

        const result = extractSuggestions(await response.json());
        if (result.error) return res.json({ error: result.error }, 502);

        log(`Generated ${result.suggestions.length} suggestions for user ${userId} (${section}).`);
        return res.json({ section, suggestions: result.suggestions });
    } catch (err) {
        error(`Gemini request failed: ${err?.message ?? err}`);
        return res.json({ error: "Could not generate suggestions. Please try again." }, 502);
    }
};
