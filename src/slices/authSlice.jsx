import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        isCreated: false,
        loading: true,
        // `authChecked` flips once the initial session lookup finishes. Route guards
        // must wait for it, otherwise protected pages render for anonymous visitors.
        authChecked: false,
        // null, not {} — an empty object is truthy and silently defeated the guard.
        userData: null,
        error: "",
    },
    reducers: {
        register: (state, action) => {
            state.loading = false;
            state.authChecked = true;
            // Any truthy `error` is a failure, whatever the status code.
            if (!action.payload || action.payload.error) {
                state.error = action.payload?.error ?? "Could not create your account.";
                state.isAuthenticated = false;
                state.isCreated = false;
                state.userData = null;
            } else {
                state.isCreated = true;
                state.isAuthenticated = true;
                state.userData = action.payload;
                state.error = "";
            }
        },
        Login: (state, action) => {
            state.loading = false;
            state.authChecked = true;
            if (!action.payload || action.payload.error) {
                state.isAuthenticated = false;
                state.error = action.payload?.error ?? "Could not sign you in.";
                state.userData = null;
            } else {
                state.isAuthenticated = true;
                state.userData = action.payload;
                state.error = "";
            }
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.isCreated = false;
            state.userData = null;
            state.loading = false;
            state.authChecked = true;
            state.error = "";
        },
        getUser: (state, action) => {
            state.loading = false;
            state.authChecked = true;
            state.userData = action.payload ?? null;
        },
    },
});

export const { register, Login, logout, getUser } = authSlice.actions;
export default authSlice.reducer;
