import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import stepperStateSlice from "./stepperStateSlice";
import currentVideoSlice from "./currentVideoSlice";
import linesSlice from "./linesSlice";

const rootReducer = combineReducers({
  stepper: stepperStateSlice,
  videoData: currentVideoSlice,
  lines: linesSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
export type AppStore = typeof store;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
export const dispatch = store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
