import OpenAI from "openai";

const ALLOWED_SECTIONS = ["experience", "project", "education", "skills", "personalDetails"];
const MAX_INPUT_CHARS = 6000;

const SYSTEM_PROMPT = `You are a technical recruiter reviewing a student or early-career resume section.
Reply with 4-6 short, specific, actionable improvements.
Rules:
- One suggestion per line, each starting with "- ".
- Point at the actual wording supplied; never invent achievements.
- Prefer concrete advice: quantify impact, lead with strong action verbs, cut filler, add missing tech/scope.
- No preamble, no closing summary, no markdown headings.`;

export default async ({ req, res, log, error }) => {
    // Appwrite sets this header for executions triggered by a logged-in client.
    const userId = req.headers["x-appwrite-user-id"];
    if (!userId) {
        return res.json({ error: "You must be signed in to request suggestions." }, 401);
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        error("OPENAI_API_KEY is not configured on the function.");
        return res.json({ error: "Suggestions are not configured yet." }, 500);
    }

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
        const openai = new OpenAI({ apiKey });
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `Resume section: ${section}\n\n${data.slice(0, MAX_INPUT_CHARS)}` },
            ],
            temperature: 0.4,
            max_tokens: 700,
        });

        const content = completion.choices?.[0]?.message?.content ?? "";
        const suggestions = content
            .split("\n")
            .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
            .filter(Boolean);

        log(`Generated ${suggestions.length} suggestions for user ${userId} (${section}).`);

        if (!suggestions.length) {
            return res.json({ error: "No suggestions came back. Please try again." }, 502);
        }

        return res.json({ section, suggestions });
    } catch (err) {
        error(`OpenAI request failed: ${err?.message ?? err}`);
        const status = err?.status === 429 ? 429 : 502;
        return res.json(
            {
                error:
                    status === 429
                        ? "Too many requests right now. Please try again in a minute."
                        : "Could not generate suggestions. Please try again.",
            },
            status
        );
    }
};
