import { Box, Divider, Text } from "@chakra-ui/react";
import React from "react";

export const TopPanel = ({ height }) => (
  <header>
    <Box
      display="flex"
      fontSize="3xl"
      height={height}
      justifyContent="space-evenly"
      alignItems="center"
      padding="5px"
    >
      <Text>Сервис анализа данных о загруженности перекрестков</Text>
    </Box>
    <Divider />
  </header>
);
