import React, { useEffect } from "react";
import { ProgressPanel } from "./components/progress-panel/ProgressPanel";
import { TopPanel } from "./components/TopPanel";
import { Route, Routes } from "react-router-dom";
import { LineDrawerCanvas } from "./components/pages/line-drawer/LineDrawerCanvas";
import { FileUploader } from "./components/pages/file-uploader/FileUploader";
import { startListening } from "./redux/api";
import { useAppDispatch } from "./redux/rootStore";
//TODO:beautify imports, make components/index

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(startListening());
  }, []);
  return (
    <>
      <TopPanel height="55px" />
      <ProgressPanel />
      <Routes>
        <Route index path="/docs" element={<FileUploader />} />
        <Route path="/edit" element={<LineDrawerCanvas />} />
        <Route path="/result" element={<section>Other</section>} />
      </Routes>
    </>
  );
};
