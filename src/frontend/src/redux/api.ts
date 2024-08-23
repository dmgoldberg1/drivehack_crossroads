import { RootState } from "./rootStore";
import backendUrl from "../backendUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { DataTypes } from "../types";
import { io } from "socket.io-client";
import { setResult } from "./currentVideoSlice";
import { setSteperState } from "./stepperStateSlice";

export const postVideo = createAsyncThunk<
  DataTypes.Image,
  any,
  { state: RootState }
>("post-video", async (requestData, thunkApi) => {
  const result = await fetch(backendUrl + "/upload_video", {
    method: "post",
    body: requestData,
  });

  if (result.status === 200) {
    const resultData = await result.json();
    thunkApi.dispatch(setSteperState(1));
    return thunkApi.fulfillWithValue(resultData);
  }
});

const socket = io(backendUrl, {
  protocols: "socket.io",
  transports: ["websockets", "pooling"],
  autoConnect: false,
  extraHeaders: { "ngrok-skip-browser-warning": "69420" },
});

export const sendLines = createAsyncThunk<
  unknown,
  undefined,
  { state: RootState }
>("send-lines", async (requestData, thunkApi) => {
  const id = thunkApi.getState().videoData.image!.video_id;
  if (id && socket.connected) {
    socket.emit(
      "lines",
      JSON.stringify({
        lines: thunkApi.getState().lines.value,
        video_id: id,
      } as DataTypes.LineRequest)
    );
    thunkApi.dispatch(setSteperState(2));
  }
});

export const startWebsocket = () => (dispatch) => {
  console.log("A");
  if (socket.connected) {
    return;
  }
  socket.on("connect", () => {
    console.log("Socket ready");
  });
  socket.on("lines-result", (data) => {
    dispatch(setResult(data));
    dispatch(setSteperState(3));
  });
  socket.connect();
};

window.addEventListener("beforeunload", () => {
  socket.off("lines-result");
  socket.off("connect");
  socket.disconnect();
});
