import { useSelector } from "react-redux";
import { RootState } from "./rootStore";
import { createSlice } from "@reduxjs/toolkit";
import { postVideo, sendLines } from "./api";
import { DataTypes } from "../types";

type initialState = {
  image: DataTypes.Image | null;
  result: DataTypes.LineResult[] | null;
  loading: boolean;
};

const currentVideoState = createSlice({
  name: "videoData",
  initialState: { image: null, result: null, loading: false } as initialState,
  reducers: {
    setResult(state, { payload }) {
      state.result = payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postVideo.pending, (state) => {
        state.result = null;
        state.image = null;
        state.loading = true;
      })
      .addCase(postVideo.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.image = payload;
      })
      .addCase(sendLines.pending, (state) => {
        state.result = null;
        state.loading = true;
      });
  },
});

export const { setResult } = currentVideoState.actions;

export const selectVideoState = () =>
  useSelector<RootState, initialState>((state) => state.videoData);
export default currentVideoState.reducer;
