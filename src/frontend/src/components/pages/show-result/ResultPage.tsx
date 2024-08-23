import React from "react";
import { selectVideoState } from "../../../redux";
import { FallbackLoader } from "../../FallbackLoader";

export const ResultPage = () => {
  const { result } = selectVideoState();

  if (!result) {
    return <FallbackLoader />;
  }

  return <div></div>;
};
