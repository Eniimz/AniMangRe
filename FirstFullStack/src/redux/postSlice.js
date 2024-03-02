import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: 'post',
    initialState: {
        thumbnailUrl : ''
    },

    reducers: {
        populateUrl: (state,action) => {
            state.thumbnailUrl = action.payload;
        }
    }
})

export default postSlice.reducer;
export const {populateUrl} = postSlice.actions;