import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: 'post',
    initialState: {
        thumbnailUrl : '',
        editDuration : '',
        postId : '',
        overallRating : ''
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
        },
        populateOverallRating : (state, action) => {
            state.overallRating = action.payload
        }
    }
})

export default postSlice.reducer;
export const {selectedPostId, populateUrl, populateDuration, populateOverallRating} = postSlice.actions;