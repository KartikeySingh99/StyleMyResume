/**
 * Turns an AppwriteException into actionable advice.
 *
 * Order matters: scope failures carry BOTH code 401 and a specific `type`, so
 * the specific types must be matched before the generic status fallback.
 */
export const explainAppwriteError = (error, { dryRun = false } = {}) => {
    const code = error?.code;
    const type = error?.type;
    const message = error?.message ?? String(error ?? "");
    const lines = [
        `\nAppwrite request failed (${code ?? "no status"}${type ? ` ${type}` : ""}): ${message}`,
    ];

    // Specific types first — several of these are also 401.
    if (type === "general_unauthorized_scope" || type === "user_unauthorized") {
        const missing = message.match(/missing scopes? \(\[(.*?)\]\)/)?.[1]?.replace(/"/g, "");
        lines.push(
            "\nThe key is valid for this project but lacks permission." +
            (missing ? `\nMissing: ${missing}` : "") +
            "\n\nFix: Appwrite Console -> Settings -> API Keys -> select your key, then" +
            "\nenable both `documents.read` and `documents.write` and save. Scopes are" +
            "\neditable on an existing key — you do not need to create a new one."
        );
    } else if (type === "api_key_invalid") {
        lines.push(
            "\nThe key does not belong to this project. In order of likelihood:" +
            "\n  1. The API key was created in a different project than APPWRITE_PROJECT_ID." +
            "\n  2. APPWRITE_ENDPOINT is wrong. Cloud projects live on regional hosts" +
            "\n     (e.g. https://fra.cloud.appwrite.io/v1) — copy it verbatim from" +
            "\n     Console -> Settings -> API Endpoint." +
            "\n  3. The value is not a server API key (a project id or JWT fails this way)."
        );
    } else if (code === 404) {
        lines.push("\nNot found — check APPWRITE_DATABASE_ID and APPWRITE_COLLECTION_ID.");
    } else if (/attribute/i.test(message)) {
        lines.push(
            "\nAttribute problem. Confirm `experienceDetails` and `title` exist and show" +
            "\nstatus `available`, and that the owner attribute is really named `User_ID`" +
            "\n(if not, update OWNER_ATTRIBUTE in scripts/lib/transform.mjs and" +
            "\nsrc/appwrite/database.js)."
        );
    } else if (code === 401) {
        lines.push("\nAuthentication failed. Check APPWRITE_API_KEY, APPWRITE_PROJECT_ID and APPWRITE_ENDPOINT.");
    }

    lines.push("\nNothing was written." + (dryRun ? "" : " Re-run with --dry-run once the config is fixed."));
    return lines.join("\n");
};

export default explainAppwriteError;
