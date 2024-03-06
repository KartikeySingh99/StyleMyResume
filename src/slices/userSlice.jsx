import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import service from "../appwrite/database";


export const fetchUserData = createAsyncThunk('getUserDetails', async (userData) => {
    if ('userId' in userData) {
        // console.log("galay chla");
        let userID = userData.userId;
        const data = await service.getData(userID);
        // console.log(data);
        if (data) {
            return data;
        }
    }
    else if ('status' in userData) {
        // console.log("chal gya",userData.$id);
        const data = await service.getData(userData.$id);
        // console.log(data);
        if (data) {
            return data;
        }
    }
})

export const editData = createAsyncThunk('editData', async ({ userID, userData }) => {
    console.log("Edit Data: ", userData);
    console.log(userID);
    const data = await service.updateData(userID, userData);
    return data;
})

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: {},
        loading: false,
        isUpdated: false
    },
    reducers: {
        saveData: (state, action) => {
            service.createData(action.payload.userID, { ...action.payload.data });
            state.user = action.payload
            state.loading = false;
        },
        // fetchData: (state, action) => {
        //     const { personalDetails, educationalDetails, expirienceDetails, skillDetails, projectDetails, ...data } = action.payload;
        //     state.user = {
        //         personalDetails: JSON.parse(personalDetails),
        //         educationalDetails: JSON.parse(educationalDetails),
        //         expirienceDetails: JSON.parse(expirienceDetails),
        //         skillDetails: JSON.parse(skillDetails),
        //         projectDetails: JSON.parse(projectDetails),
        //         ...data
        //     }
        //     state.loading = false;
        // },
        userRegister: (state, action) => {
            state.user.isAuthenticated = action.payload;
        },
        // editData: (state, action) => {
        //     service.updateData(action.payload.userID, { ...action.payload.userData })
        //     console.log(action.payload.userID);
        //     console.log(action.payload.userData);
        //     state.user = action.payload.data;
        //     state.loading = false;
        //     state.isUpdated = true;
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                const { personalDetails, educationalDetails, expirienceDetails, skillDetails, projectDetails, ...data } = action.payload;
                state.user = {
                    personalDetails: JSON.parse(personalDetails),
                    educationalDetails: JSON.parse(educationalDetails),
                    expirienceDetails: JSON.parse(expirienceDetails),
                    skillDetails: JSON.parse(skillDetails),
                    projectDetails: JSON.parse(projectDetails),
                    ...data
                }
                state.loading = false;
            })
            .addCase(fetchUserData.rejected, (state) => {
                state.error = "cannot fetch data";
                state.user = null;
                state.loading = false;
            })
            .addCase(editData.pending, (state) => {
                state.loading = true;
            })
            .addCase(editData.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.isUpdated = true;
            })
            .addCase(editData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            })
    }
})

export const { saveData, fetchData } = userSlice.actions;
export default userSlice.reducer;