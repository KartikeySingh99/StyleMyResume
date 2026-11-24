import { Account, Client } from "appwrite";
import config from "../config/config";

/** Netlify function; see netlify/functions/ai-suggestions.mjs. */
const AI_ENDPOINT = "/.netlify/functions/ai-suggestions";

/**
 * Requests resume suggestions. The Gemini key lives server-side, and the
 * endpoint is public, so each call carries a short-lived Appwrite JWT that the
 * function verifies before spending any quota.
 *
 * Always resolves to either { suggestions: string[] } or { error: string },
 * never a thrown exception or a raw Error object, so callers can render it.
 */
export class SuggestionService {
    client = new Client();
    account;

    constructor() {
        this.client.setEndpoint(config.appwriteURL).setProject(config.appWriteProjectID);
        this.account = new Account(this.client);
    }

    async getResumeSuggestions(resumeSection, data) {
        if (!String(data ?? "").trim()) {
            return { error: "Add some content to this section first." };
        }

        let jwt;
        try {
            ({ jwt } = await this.account.createJWT());
        } catch {
            return { error: "Please sign in again to use AI suggestions." };
        }

        let response;
        try {
            response = await fetch(AI_ENDPOINT, {
                method: "POST",
                headers: { "content-type": "application/json", "x-appwrite-jwt": jwt },
                body: JSON.stringify({ section: resumeSection, data }),
            });
        } catch {
            return { error: "Could not reach the suggestions service. Check your connection." };
        }

        // `vite dev` does not serve Netlify functions — use `netlify dev` locally.
        if (response.status === 404) {
            return { error: "AI suggestions aren't available in this environment." };
        }

        const payload = await response.json().catch(() => null);
        if (!payload) return { error: "Could not generate suggestions. Please try again." };
        if (payload.error) return { error: String(payload.error) };

        const suggestions = Array.isArray(payload.suggestions)
            ? payload.suggestions.filter((item) => String(item ?? "").trim())
            : [];

        return suggestions.length
            ? { suggestions }
            : { error: "No suggestions came back. Please try again." };
    }
}

const suggestionService = new SuggestionService();

const getResumeSuggestions = (resumeSection, data) =>
    suggestionService.getResumeSuggestions(resumeSection, data);

export default getResumeSuggestions;
