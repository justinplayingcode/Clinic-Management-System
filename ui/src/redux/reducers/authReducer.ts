import { createSlice } from "@reduxjs/toolkit";
import { Role } from "../../app/model/enum/auth";

interface CurrentUserState {
    role: Role | null;
    phoneNumber: string | null;
    info: any;
}

const initialState: CurrentUserState = {
    role: null,
    phoneNumber: null,
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
            state.phoneNumber = action.payload
        },
        setInfoUser: (state, action) => {
            const oldInfo = state.info
            state.info = { ...oldInfo, ...action.payload}
        },
        userLogout: (state) => {
            state.role = null,
            state.phoneNumber = null,
            state.info = null
        }
    }
})

export const { setRole, setPhoneNumber, setInfoUser, userLogout } = authSlice.actions;

export default authSlice.reducer;