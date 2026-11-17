import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import service from "../appwrite/database";

/** Accepts either an Appwrite session (`userId`) or an account object (`$id`). */
const resolveUserID = (userData) => {
    if (!userData || typeof userData !== "object") return null;
    if (userData.userId) return userData.userId;
    if (userData.$id) return userData.$id;
    return null;
};

const parseSection = (value, fallback) => {
    if (value === null || value === undefined) return fallback;
    if (typeof value !== "string") return value;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
};

/** Turns a raw Appwrite document into the shape the UI expects. */
const normalizeDocument = (document = {}) => {
    const { personalDetails, educationalDetails, expirienceDetails, skillDetails, projectDetails, ...rest } =
        document;

    return {
        ...rest,
        personalDetails: parseSection(personalDetails, {}),
        educationalDetails: parseSection(educationalDetails, []),
        expirienceDetails: parseSection(expirienceDetails, []),
        skillDetails: parseSection(skillDetails, []),
        projectDetails: parseSection(projectDetails, []),
    };
};

export const fetchUserData = createAsyncThunk(
    "user/fetchUserData",
    async (userData, { rejectWithValue }) => {
        const userID = resolveUserID(userData);
        // Previously this returned undefined, and the reducer then destructured
        // undefined — a TypeError that blanked the whole page.
        if (!userID) return rejectWithValue({ error: "Not signed in.", code: 401 });

        const data = await service.getData(userID);
        if (!data || data.error) {
            return rejectWithValue({ error: data?.error ?? "No data found!", code: data?.code ?? 404 });
        }
        return data;
    }
);

export const saveUserData = createAsyncThunk(
    "user/saveUserData",
    async ({ userID, data }, { rejectWithValue }) => {
        if (!userID) return rejectWithValue("Not signed in.");
        try {
            // Side effects belong here, not in a reducer.
            return await service.createData(userID, data);
        } catch (error) {
            return rejectWithValue(
                error?.response?.message ?? error?.message ?? "Could not save your details."
            );
        }
    }
);

export const editData = createAsyncThunk(
    "user/editData",
    async ({ userID, userData }, { rejectWithValue }) => {
        if (!userID) return rejectWithValue("Not signed in.");
        const data = await service.updateData(userID, userData);
        if (!data || data.error) {
            return rejectWithValue(data?.error ?? "Could not save your changes.");
        }
        return data;
    }
);

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: {},
        loading: false,
        isUpdated: false,
        error: null,
    },
    reducers: {
        resetUser: (state) => {
            state.user = {};
            state.error = null;
            state.isUpdated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user.userData = normalizeDocument(action.payload);
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error ?? "Cannot fetch data";
            })
            .addCase(saveUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveUserData.fulfilled, (state, action) => {
                state.loading = false;
                state.isUpdated = true;
                state.user.userData = normalizeDocument(action.payload);
            })
            .addCase(saveUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Could not save your details.";
            })
            .addCase(editData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editData.fulfilled, (state, action) => {
                state.loading = false;
                state.isUpdated = true;
                state.user.userData = normalizeDocument(action.payload);
            })
            .addCase(editData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Could not save your changes.";
            });
    },
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
