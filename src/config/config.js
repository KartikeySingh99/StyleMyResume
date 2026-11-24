// NOTE: every VITE_* variable is inlined into the public client bundle.
// Only non-secret identifiers belong here — secrets (e.g. the Gemini key) live
// as server-side environment variables on the Netlify function instead.
const config = {
    appwriteURL: import.meta.env.VITE_APPWRITE_URL,
    appWriteProjectID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    appWriteDatabaseID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    appWriteCollectionID: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
};

if (import.meta.env.DEV) {
    const required = ["appwriteURL", "appWriteProjectID", "appWriteDatabaseID", "appWriteCollectionID"];
    const missing = required.filter((key) => !config[key]);
    if (missing.length) {
        console.warn(`Missing Appwrite env vars: ${missing.join(", ")}. See .env.example.`);
    }
}

export default config;
