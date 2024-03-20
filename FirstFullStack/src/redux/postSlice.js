import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: 'post',
    initialState: {
        thumbnailUrl : '',
        editDuration : '',
        postId : '',
    },

    reducers: {
        populateUrl: (state,action) => {
            state.thumbnailUrl = action.payload;
        },
        populateDuration: (state, action) => {
            state.editDuration = action.payload
        },
        selectedPostId : (state, action) => {
            state.postId = action.payload;
        }
    }
})

export default postSlice.reducer;
export const {selectedPostId, populateUrl, populateDuration} = postSlice.actions;