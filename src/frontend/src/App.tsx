import React, { useEffect } from "react";
import { ProgressPanel } from "./components/progress-panel/ProgressPanel";
import { TopPanel } from "./components/TopPanel";
import { Route, Routes } from "react-router-dom";
import { LineDrawerCanvas } from "./components/pages/line-drawer/LineDrawerCanvas";
import { FileUploader } from "./components/pages/file-uploader/FileUploader";
import { startWebsocket } from "./redux/api";
import { useAppDispatch } from "./redux/rootStore";
import { ResultPage } from "./components/pages/show-result/ResultPage";
//TODO:beautify imports, make components/index

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(startWebsocket());
  }, []);

  return (
    <>
      <TopPanel height="55px" />
      <ProgressPanel />
      <Routes>
        <Route index path="/drivehack_crossroads" element={<FileUploader />} />
        <Route path="/edit" element={<LineDrawerCanvas />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </>
  );
};
