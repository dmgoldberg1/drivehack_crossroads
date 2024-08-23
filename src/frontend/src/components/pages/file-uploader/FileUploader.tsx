import React, { useEffect } from "react";
import { FileUploaderForm } from "./FileUploaderForm";
import { selectVideoState } from "../../../redux";
import { useNavigate } from "react-router-dom";

export const FileUploader = () => {
  const { loading, image } = selectVideoState();
  const navigate = useNavigate();

  useEffect(() => {
    if (image) {
      navigate("/edit");
    }
  }, [loading]);

  return <FileUploaderForm isFetching={loading} />;
};
