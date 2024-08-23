import React from "react";
import { selectVideoState } from "../../../redux";
import { FallbackLoader } from "../../FallbackLoader";
import { ResultChart } from "./ResultChart";

export const ResultPage = () => {
  const { result } = selectVideoState();

  if (!result) {
    return <FallbackLoader />;
  }

  return <ResultChart inputData={result} />;
};
