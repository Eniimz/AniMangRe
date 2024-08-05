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
        },
        updateReq: state => {
            state.loading = true
            state.errorMessage = ''
        },
        updateSuccess: (state, action) => {
            state.loading = false,
            state.data = action.payload
        },
        updateFail: (state, action) => {
            state.loading = false,
            state.errorMessage = action.payload
        },
        deleteReq: state => {
            state.loading = true,
            state.errorMessage = ''
        },
        deleteSuccess: state => {
            state.loading = false,
            state.data = null
        },
        deleteFail: (state, action) => {
            state.loading = false,
            state.errorMessage = action.payload
        },
        signOut: state => {
            state.loading = false,
            state.errorMessage = '',
            state.data = null
        }


    }

})

export default userSlice.reducer;
export const {signInReq, signInSuccess, signInFail, updateReq, updateSuccess, updateFail, deleteReq, deleteSuccess, deleteFail, signOut} = userSlice.actions