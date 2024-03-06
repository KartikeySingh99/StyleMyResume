import { Client, Account, ID } from "appwrite";
import config from "../config/config";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(config.appwriteURL)
            .setProject(config.appWriteProjectID)
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name)
            if (userAccount) {
                return this.login({ email, password });
                // return userAccount;
            }
            else {
                // throw Error("Failed to Create User");
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailSession(email, password);
        }
        catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        }
        catch (error) {
            console.log("no user found!");
        }
    }

    async logout() {
        try {
            this.account.deleteSessions();
        }
        catch (error) {
            console.log("Logout Error", error);
        }
    }
}

const authService = new AuthService();

export default authService;

