// File: store/categorySlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CategoryState {
    selectedCategory: string | null;
    selectedSubCategory: string | null;
}

const initialState: CategoryState = {
    selectedCategory: null,
    selectedSubCategory: null,
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setSelectedCategory: (state, action: PayloadAction<string>) => {
            state.selectedCategory = action.payload;
            state.selectedSubCategory = null; // Reset subcategory when a new category is selected
        },
        setSelectedSubCategory: (state, action: PayloadAction<string>) => {
            state.selectedSubCategory = action.payload;
        },
    },
});

export const { setSelectedCategory, setSelectedSubCategory } = categorySlice.actions;
export default categorySlice.reducer;
