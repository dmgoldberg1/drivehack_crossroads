import { useSelector } from "react-redux";
import { RootState } from "./rootStore";
import { createSlice } from "@reduxjs/toolkit";
import { postVideo } from "./api";
import { DataTypes } from "../types";

const linesState = createSlice({
  name: "lines",
  initialState: { value: [] as DataTypes.Line[] },
  reducers: {
    setLines(state, { payload }) {
      state.value = payload;
    },
    addLine(state, { payload }) {
      state.value.push(payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postVideo.pending, (state) => {
      state.value = [];
    });
  },
});

export const { addLine, setLines } = linesState.actions;

export const selectLines = () =>
  useSelector<RootState, DataTypes.Line[]>((state) => state.lines.value);
export default linesState.reducer;
