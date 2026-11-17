import config from "../config/config";
import { Client, Databases, Permission, Role } from "appwrite";

const SECTIONS = [
    "personalDetails",
    "educationalDetails",
    "expirienceDetails",
    "skillDetails",
    "projectDetails",
];

/** Sections are stored as JSON strings in Appwrite attributes. */
const serializeSections = (data = {}) =>
    SECTIONS.reduce((payload, key) => {
        payload[key] = JSON.stringify(data[key] ?? (key === "personalDetails" ? {} : []));
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

    async createData(User_ID, data) {
        // Explicit document-level permissions: without these, access falls back to
        // collection-level rules and one signed-in user can read another's resume.
        const permissions = [
            Permission.read(Role.user(User_ID)),
            Permission.update(Role.user(User_ID)),
            Permission.delete(Role.user(User_ID)),
        ];

        return this.databases.createDocument(
            config.appWriteDatabaseID,
            config.appWriteCollectionID,
            User_ID,
            { User_ID, ...serializeSections(data) },
            permissions
        );
    }

    async getData(User_ID) {
        try {
            return await this.databases.getDocument(
                config.appWriteDatabaseID,
                config.appWriteCollectionID,
                User_ID
            );
        } catch (error) {
            return { error: readableError(error, "No data found!"), code: error?.code };
        }
    }

    async updateData(userID, data) {
        try {
            // Returning the updated document lets the store refresh without a refetch.
            return await this.databases.updateDocument(
                config.appWriteDatabaseID,
                config.appWriteCollectionID,
                userID,
                serializeSections(data)
            );
        } catch (error) {
            return { error: readableError(error, "Could not save your changes."), code: error?.code };
        }
    }

    async deleteData(Document_ID) {
        try {
            await this.databases.deleteDocument(
                config.appWriteDatabaseID,
                config.appWriteCollectionID,
                Document_ID
            );
            return { success: true };
        } catch (error) {
            return { error: readableError(error, "Could not delete your data."), code: error?.code };
        }
    }
}

const service = new Service();

export default service;
