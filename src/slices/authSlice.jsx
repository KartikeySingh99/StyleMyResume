import { createSlice } from "@reduxjs/toolkit";


export const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        isCreated: false,
        loading: true,
        userData: {}
    },
    reducers: {
        register: (state) => {
            state.isCreated = true;
        },
        Login: (state, action) => {
            // console.log("login Data=>",action.payload);
            state.isAuthenticated = true;
            state.userData = action.payload;
            state.loading = false;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.userData = null
        },
        getUser: (state, action) => {
            // console.log("userData reducer=>",action.payload);
            state.userData = action.payload;
            state.loading = false;
        }
    }
})

export const { register, Login, logout, getUser } = authSlice.actions;
export default authSlice.reducer;