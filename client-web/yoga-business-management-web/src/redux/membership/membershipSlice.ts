// src/store/membershipSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosClient";

// Gọi API để lấy membership
export const fetchMembership = createAsyncThunk("membership/fetch", async () => {
    const response = await axiosInstance.get("/api/membership/type");
    return response.data.data;
});

const membershipSlice = createSlice({
    name: "membership",
    initialState: {
        medal: null,
        status: "idle",
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMembership.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchMembership.fulfilled, (state, action) => {
                state.medal = action.payload;
                state.status = "succeeded";
            })
            .addCase(fetchMembership.rejected, (state) => {
                state.status = "failed";
            });
    },
});

export default membershipSlice.reducer;
