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
        register: (state) => {
            state.isCreated = true;
        },
        Login: (state, action) => {
            state.loading = false;
            if (action.payload.code === 401) {
                state.isAuthenticated = false;
                state.error = action.payload.error;
            } else {
                state.isAuthenticated = true;
                state.userData = action.payload;
                state.error = null
            }
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.userData = null
        },
        getUser: (state, action) => {
            state.loading = false;
            state.userData = action.payload;
        }
    }
})

export const { register, Login, logout, getUser } = authSlice.actions;
export default authSlice.reducer;