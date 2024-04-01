import config from "../config/config";
import { Client, Databases, ID, Permission, Role } from "appwrite";


export class Service {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(config.appwriteURL)
            .setProject(config.appWriteProjectID)
        this.databases = new Databases(this.client);
    }

    async createData(User_ID, {
        personalDetails,
        educationalDetails,
        expirienceDetails,
        skillDetails,
        projectDetails }) {
        // eslint-disable-next-line no-useless-catch
        try {
            console.log(User_ID);
            // const personalDetails = JSON.stringify(personalDetails);
            // const educationalDetails = JSON.stringify(educationalDetails);
            // const expirienceDetails = JSON.stringify(expirienceDetails);
            // const skillDetails = JSON.stringify(skillDetails)
            // const projectDetails = JSON.stringify(projectDetails)
            const data = await this.databases.createDocument(config.appWriteDatabaseID, config.appWriteCollectionID, User_ID, {
                User_ID,
                personalDetails: JSON.stringify(personalDetails),
                educationalDetails: JSON.stringify(educationalDetails),
                expirienceDetails: JSON.stringify(expirienceDetails),
                skillDetails: JSON.stringify(skillDetails),
                projectDetails: JSON.stringify(projectDetails)
            }, [
                Permission.read(Role.user(User_ID)),
                Permission.update(Role.user(User_ID)),
                Permission.delete(Role.user(User_ID)),
            ])
            if (data) {
                return data;
            }
        }
        catch (err) {
            throw err;
        }
    }

    async getData(User_ID) {
        try {
            const data = await this.databases.getDocument(config.appWriteDatabaseID, config.appWriteCollectionID, User_ID)
            if (data) {
                return data;
            }
            else {
                return "No Data Available!";
            }
        }
        catch (error) {
            console.log(error.response.message);
            return { error: "No data Found!", code: error.code };
        }
    }

    async updateData(User_ID, {
        personalDetails,
        educationalDetails,
        expirienceDetails,
        skillDetails,
        projectDetails
    }) {
        try {
            await this.databases.updateDocument(config.appWriteDatabaseID, config.appWriteCollectionID, User_ID, {
                personalDetails: JSON.stringify(personalDetails),
                educationalDetails: JSON.stringify(educationalDetails),
                expirienceDetails: JSON.stringify(expirienceDetails),
                skillDetails: JSON.stringify(skillDetails),
                projectDetails: JSON.stringify(projectDetails)
            })
        }
        catch (error) {
            console.log(error);
        }
    }

    async deleteData(Document_ID) {
        try {
            await this.databases.deleteDocument(config.appWriteDatabaseID, config.appWriteCollectionID, Document_ID)
        }
        catch (error) {
            console.log(error);
        }
    }
}

const service = new Service();

export default service;