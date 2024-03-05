import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: 'post',
    initialState: {
        thumbnailUrl : '',
        editDuration : ''
    },

    reducers: {
        populateUrl: (state,action) => {
            state.thumbnailUrl = action.payload;
        },
        populateDuration: (state, action) => {
            state.editDuration = action.payload
        }
    }
})

export default postSlice.reducer;
export const {populateUrl, populateDuration} = postSlice.actions;