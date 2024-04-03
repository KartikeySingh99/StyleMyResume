import { createSlice } from "@reduxjs/toolkit";


export const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        isCreated: false,
        loading: true,
        userData: {},
        error: ""
    },
    reducers: {
        register: (state, action) => {
            console.log(action.payload);
            state.loading = false
            if (action.payload.code === 400) {
                state.error = action.payload.error;
                state.isAuthenticated = false;
                state.isCreated = false;
            }
            else {
                state.isCreated = true;
                state.isAuthenticated = true;
                state.error = null
            }
        },
        Login: (state, action) => {
            state.loading = true;
            if (action.payload.code === 401) {
                state.isAuthenticated = false;
                state.error = action.payload.error;
                state.loading = false;
            } else {
                state.isAuthenticated = true;
                state.userData = action.payload;
                state.error = null
                state.loading = false;
            }
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.userData = null;
            state.loading = false
        },
        getUser: (state, action) => {
            state.loading = true;
            state.userData = action.payload;
            state.loading = false;
        }
    }
})

export const { register, Login, logout, getUser } = authSlice.actions;
export default authSlice.reducer;