import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    socket: null,
    socketId: null
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setLoading(state, action) {
            state.isLoading = !state.isLoading
        },
        setSocketId(state, action) {
            state.socketId = action.payload
        },
        setSocket(state, action) {
            state.socket = action.payload
        }
    }
})

export const { setLoading, setSocketId, setSocket } = appSlice.actions;
export default appSlice.reducer;