import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
    name: 'mode',
    initialState: {
        mode: 'light'
    },

    reducers: {
        toggleMode: state => {
            state.mode = state.mode === 'dark' ? 'light' : 'dark' 
        }
    }
})

export default themeSlice.reducer;
export const { toggleMode } = themeSlice.actions