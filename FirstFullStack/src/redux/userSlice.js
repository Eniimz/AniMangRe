import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    loading : false,
    data: null,
    errorMessage: ''
}

const userSlice = createSlice({
    name: 'user',
    initialState,

    reducers: {
        signInReq: state => {
            state.loading = true
            state.errorMessage = ''
        },
        signInSuccess: (state, action) => {
            state.loading = false,
            state.data = action.payload
        },
        signInFail: (state, action) => {
            state.loading = false,
            state.errorMessage = action.payload
        }

    }

})

export default userSlice.reducer;
export const {signInReq, signInSuccess, signInFail} = userSlice.actions