import { createSlice } from "@reduxjs/toolkit";
import { Role } from "../../app/model/enum/auth";

interface CurrentUserState {
    role: Role | null;
    phonenumber: string | null;
    info: any;
}

const initialState: CurrentUserState = {
    role: null,
    phonenumber: null,
    info: {},
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setRole: (state, action) => {
            state.role = action.payload
        },
        setPhoneNumber: (state, action) => {
            state.phonenumber = action.payload
        },
        setInfoUser: (state, action) => {
            state.info = action.payload
        },
        userLogout: (state) => {
            state.role = null,
            state.phonenumber = null,
            state.info = null
        }
    }
})

export const { setRole, setPhoneNumber, setInfoUser, userLogout } = authSlice.actions;

export default authSlice.reducer;