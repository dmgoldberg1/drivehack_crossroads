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
  autoConnect: false,
  transports: ["polling"],
  extraHeaders: { "ngrok-skip-browser-warning": "69420" },
});

export const sendLines = createAsyncThunk<
  any,
  DataTypes.Line[],
  { state: RootState }
>("send-lines", async (requestData, thunkApi) => {
  const id = thunkApi.getState().videoData.image!.video_id;
  if (id && socket.connected) {
    const data = {
      lines: requestData,
      video_id: id,
    } as DataTypes.LineRequest;
    socket.emit("lines", JSON.stringify(data));
    thunkApi.dispatch(setSteperState(2));
  }
});

export const startWebsocket = () => (dispatch) => {
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
  console.log("socket disconnect");
  socket.off("lines-result");
  socket.off("connect");
  socket.disconnect();
});
