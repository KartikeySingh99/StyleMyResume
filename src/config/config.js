// NOTE: every VITE_* variable is inlined into the public client bundle.
// Only non-secret identifiers belong here — secrets (e.g. the OpenAI key) must
// live as server-side function variables instead.
const config = {
    appwriteURL: import.meta.env.VITE_APPWRITE_URL,
    appWriteProjectID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    appWriteDatabaseID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    appWriteCollectionID: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
    appWriteAIFunctionID: import.meta.env.VITE_APPWRITE_AI_FUNCTION_ID,
};

if (import.meta.env.DEV) {
    const required = ["appwriteURL", "appWriteProjectID", "appWriteDatabaseID", "appWriteCollectionID"];
    const missing = required.filter((key) => !config[key]);
    if (missing.length) {
        console.warn(`Missing Appwrite env vars: ${missing.join(", ")}. See .env.example.`);
    }
}

export default config;
