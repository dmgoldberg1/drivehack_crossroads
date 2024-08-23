import { useSelector } from "react-redux";
import { RootState } from "./rootStore";
import { createSlice } from "@reduxjs/toolkit";

const stepperState = createSlice({
  name: "stepper",
  initialState: { current: 0 },
  reducers: {
    setSteperState: (state, { payload }: { payload: number }) => {
      state.current = payload;
    },
  },
});

export const { setSteperState } = stepperState.actions;
export const selectStepperState = () =>
  useSelector<RootState, number>((state) => state.stepper.current);
export default stepperState.reducer;
