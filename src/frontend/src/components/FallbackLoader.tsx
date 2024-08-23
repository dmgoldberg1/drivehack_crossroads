import { Text } from "@chakra-ui/react";
import React from "react";
import { BarLoader } from "react-spinners";

export const FallbackLoader = () => (
  <>
    <Text>Загрузка...</Text>
    <BarLoader width="100%" />
  </>
);
