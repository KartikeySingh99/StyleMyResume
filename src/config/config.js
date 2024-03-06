const config = {
    appwriteURL: String(import.meta.env.VITE_APPWRITE_URL),
    appWriteProjectID: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appWriteDatabaseID: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appWriteCollectionID: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID)
}

export default config;