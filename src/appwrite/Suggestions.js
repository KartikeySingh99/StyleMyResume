import { Client, Functions } from "appwrite";
import config from "../config/config";

/**
 * Calls the `ai-suggestions` Appwrite function. The OpenAI key stays on the
 * server — see functions/ai-suggestions/README.md.
 *
 * Always resolves to either { suggestions: string[] } or { error: string },
 * never a thrown exception or a raw Error object, so callers can render it.
 */
export class SuggestionService {
    client = new Client();
    functions;

    constructor() {
        this.client.setEndpoint(config.appwriteURL).setProject(config.appWriteProjectID);
        this.functions = new Functions(this.client);
    }

    async getResumeSuggestions(resumeSection, data) {
        if (!config.appWriteAIFunctionID) {
            return { error: "AI suggestions aren't configured yet." };
        }
        if (!String(data ?? "").trim()) {
            return { error: "Add some content to this section first." };
        }

        try {
            const execution = await this.functions.createExecution(
                config.appWriteAIFunctionID,
                JSON.stringify({ section: resumeSection, data }),
                false,
                "/",
                "POST",
                { "content-type": "application/json" }
            );

            const body = execution.responseBody ?? execution.response ?? "";
            let parsed;
            try {
                parsed = JSON.parse(body);
            } catch {
                return { error: "Could not generate suggestions. Please try again." };
            }

            if (parsed?.error) return { error: String(parsed.error) };

            const suggestions = Array.isArray(parsed?.suggestions)
                ? parsed.suggestions.filter((item) => String(item ?? "").trim())
                : [];

            return suggestions.length
                ? { suggestions }
                : { error: "No suggestions came back. Please try again." };
        } catch (error) {
            return {
                error: error?.response?.message ?? error?.message ?? "Could not generate suggestions.",
            };
        }
    }
}

const suggestionService = new SuggestionService();

const getResumeSuggestions = (resumeSection, data) =>
    suggestionService.getResumeSuggestions(resumeSection, data);

export default getResumeSuggestions;
