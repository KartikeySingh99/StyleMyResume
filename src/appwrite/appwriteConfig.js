import { Client, Account, ID } from "appwrite";
import config from "../config/config";

const readableError = (error, fallback) => ({
    error: error?.response?.message ?? error?.message ?? fallback,
    code: error?.code,
});

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client.setEndpoint(config.appwriteURL).setProject(config.appWriteProjectID);
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            await this.account.create(ID.unique(), email, password, name);
            // Propagates a login failure as-is, so the caller never treats it as success.
            return await this.login({ email, password });
        } catch (error) {
            // Appwrite returns 409 for "user already exists", 429 when rate limited —
            // callers must look at `error`, not at a specific status code.
            return readableError(error, "Could not create your account.");
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailSession(email, password);
        } catch (error) {
            return readableError(error, "Could not sign you in.");
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            return { error: "User Not Logged In!", code: error?.code };
        }
    }

    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            return readableError(error, "Could not sign you out.");
        }
    }
}

const authService = new AuthService();

export default authService;
