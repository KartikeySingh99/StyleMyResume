import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import service, { DEFAULT_RESUME_TITLE } from "../appwrite/database";

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

/**
 * Turns a raw Appwrite document into the shape the UI expects.
 * `expirienceDetails` is the pre-migration spelling — documents written before
 * the backfill still carry it, so both names are accepted on read.
 */
const normalizeDocument = (document = {}) => {
    const {
        personalDetails,
        educationalDetails,
        experienceDetails,
        skillDetails,
        projectDetails,
        ...rest
    } = document;

    return {
        ...rest,
        title: rest.title || DEFAULT_RESUME_TITLE,
        personalDetails: parseSection(personalDetails, {}),
        educationalDetails: parseSection(educationalDetails, []),
        experienceDetails: parseSection(experienceDetails, []),
        skillDetails: parseSection(skillDetails, []),
        projectDetails: parseSection(projectDetails, []),
    };
};

/** Keeps `resumes` and the active resume in sync after any write. */
const setActiveResume = (state, resume) => {
    state.activeResumeId = resume?.$id ?? null;
    // `user.userData` is the active resume; the screens read it directly.
    state.user.userData = resume ?? undefined;
};

const upsertResume = (state, resume) => {
    const index = state.resumes.findIndex((item) => item.$id === resume.$id);
    if (index === -1) state.resumes.unshift(resume);
    else state.resumes[index] = resume;
    setActiveResume(state, resume);
};

export const fetchUserData = createAsyncThunk(
    "user/fetchUserData",
    async (userData, { rejectWithValue }) => {
        const userID = resolveUserID(userData);
        if (!userID) return rejectWithValue({ error: "Not signed in.", code: 401 });

        const result = await service.listResumes(userID);
        if (result?.error) {
            return rejectWithValue({ error: result.error, code: result.code ?? 404 });
        }
        return result.documents ?? [];
    }
);

export const saveUserData = createAsyncThunk(
    "user/saveUserData",
    async ({ userID, data, title }, { rejectWithValue }) => {
        if (!userID) return rejectWithValue("Not signed in.");
        const result = await service.createResume(userID, data, title ?? DEFAULT_RESUME_TITLE);
        if (!result || result.error) {
            return rejectWithValue(result?.error ?? "Could not save your details.");
        }
        return result;
    }
);

export const editData = createAsyncThunk(
    "user/editData",
    async ({ documentID, userData, title }, { rejectWithValue }) => {
        // Document id, not user id — the two were interchangeable only in the old model.
        if (!documentID) return rejectWithValue("Missing resume id.");
        const result = await service.updateResume(documentID, userData, title);
        if (!result || result.error) {
            return rejectWithValue(result?.error ?? "Could not save your changes.");
        }
        return result;
    }
);

export const removeResume = createAsyncThunk(
    "user/removeResume",
    async (documentID, { rejectWithValue }) => {
        const result = await service.deleteResume(documentID);
        if (!result || result.error) {
            return rejectWithValue(result?.error ?? "Could not delete this resume.");
        }
        return documentID;
    }
);

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: {},
        resumes: [],
        activeResumeId: null,
        loading: false,
        isUpdated: false,
        error: null,
    },
    reducers: {
        resetUser: (state) => {
            state.user = {};
            state.resumes = [];
            state.activeResumeId = null;
            state.error = null;
            state.isUpdated = false;
        },
        selectResume: (state, action) => {
            const resume = state.resumes.find((item) => item.$id === action.payload);
            if (resume) setActiveResume(state, resume);
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
                state.resumes = action.payload.map(normalizeDocument);
                // Most recently updated wins until there is a resume picker.
                const active =
                    state.resumes.find((item) => item.$id === state.activeResumeId) ?? state.resumes[0];
                setActiveResume(state, active);
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
                upsertResume(state, normalizeDocument(action.payload));
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
                upsertResume(state, normalizeDocument(action.payload));
            })
            .addCase(editData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Could not save your changes.";
            })
            .addCase(removeResume.fulfilled, (state, action) => {
                state.resumes = state.resumes.filter((item) => item.$id !== action.payload);
                if (state.activeResumeId === action.payload) {
                    setActiveResume(state, state.resumes[0]);
                }
            })
            .addCase(removeResume.rejected, (state, action) => {
                state.error = action.payload ?? "Could not delete this resume.";
            });
    },
});

export const { resetUser, selectResume } = userSlice.actions;
export default userSlice.reducer;
