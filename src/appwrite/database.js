import config from "../config/config";
import { Client, Databases, ID, Permission, Query, Role } from "appwrite";

export const OWNER_ATTRIBUTE = "User_ID";
export const DEFAULT_RESUME_TITLE = "My Resume";

/** Attributes written on save; each holds a JSON-serialized section. */
const SECTION_DEFAULTS = {
    personalDetails: {},
    educationalDetails: [],
    experienceDetails: [],
    skillDetails: [],
    projectDetails: [],
};

/** Sections are stored as JSON strings in Appwrite attributes. */
const serializeSections = (data = {}) =>
    Object.entries(SECTION_DEFAULTS).reduce((payload, [key, fallback]) => {
        payload[key] = JSON.stringify(data[key] ?? fallback);
        return payload;
    }, {});

const readableError = (error, fallback) =>
    error?.response?.message ?? error?.message ?? fallback;

export class Service {
    client = new Client();
    databases;

    constructor() {
        this.client.setEndpoint(config.appwriteURL).setProject(config.appWriteProjectID);
        this.databases = new Databases(this.client);
    }

    /**
     * Owner-scoped lookup. Documents used to be keyed by the user id, which capped
     * every account at a single resume; they now use ID.unique() and are found via
     * the indexed owner attribute. Requires a key index on `User_ID`.
     */
    async listResumes(userID) {
        if (!userID) return { error: "Not signed in.", code: 401 };
        try {
            const { documents } = await this.databases.listDocuments(
                config.appWriteDatabaseID,
                config.appWriteCollectionID,
                [Query.equal(OWNER_ATTRIBUTE, userID), Query.limit(100)]
            );
            // Sorted here rather than with Query.orderDesc so no extra index is needed.
            return {
                documents: [...documents].sort((a, b) =>
                    String(b.$updatedAt ?? "").localeCompare(String(a.$updatedAt ?? ""))
                ),
            };
        } catch (error) {
            return { error: readableError(error, "Could not load your resumes."), code: error?.code };
        }
    }

    async getResume(documentID) {
        if (!documentID) return { error: "Missing resume id.", code: 400 };
        try {
            return await this.databases.getDocument(
                config.appWriteDatabaseID,
                config.appWriteCollectionID,
                documentID
            );
        } catch (error) {
            return { error: readableError(error, "No data found!"), code: error?.code };
        }
    }

    async createResume(userID, data = {}, title = DEFAULT_RESUME_TITLE) {
        if (!userID) return { error: "Not signed in.", code: 401 };

        // Explicit document-level permissions: without these, access falls back to
        // collection-level rules and one signed-in user can read another's resume.
        const permissions = [
            Permission.read(Role.user(userID)),
            Permission.update(Role.user(userID)),
            Permission.delete(Role.user(userID)),
        ];

        try {
            return await this.databases.createDocument(
                config.appWriteDatabaseID,
                config.appWriteCollectionID,
                ID.unique(),
                { [OWNER_ATTRIBUTE]: userID, title, ...serializeSections(data) },
                permissions
            );
        } catch (error) {
            return { error: readableError(error, "Could not save your details."), code: error?.code };
        }
    }

    /** Updates by document id — not by user id, which only worked in the old model. */
    async updateResume(documentID, data = {}, title) {
        if (!documentID) return { error: "Missing resume id.", code: 400 };
        try {
            const payload = serializeSections(data);
            if (title !== undefined) payload.title = title;

            return await this.databases.updateDocument(
                config.appWriteDatabaseID,
                config.appWriteCollectionID,
                documentID,
                payload
            );
        } catch (error) {
            return { error: readableError(error, "Could not save your changes."), code: error?.code };
        }
    }

    async deleteResume(documentID) {
        if (!documentID) return { error: "Missing resume id.", code: 400 };
        try {
            await this.databases.deleteDocument(
                config.appWriteDatabaseID,
                config.appWriteCollectionID,
                documentID
            );
            return { success: true };
        } catch (error) {
            return { error: readableError(error, "Could not delete this resume."), code: error?.code };
        }
    }
}

const service = new Service();

export default service;
