import {
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  Box,
} from "@chakra-ui/react";
import React from "react";
import steps from "./steps";
import { selectStepperState } from "../../redux/stepperStateSlice";

export const ProgressPanel = () => {
  const activeStep = selectStepperState();
  return (
    <Stepper m="10px" index={activeStep} colorScheme="red">
      {Object.keys(steps).map((key, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box flexShrink="0">
            <StepTitle>{key}</StepTitle>
            <StepDescription>{steps[key]}</StepDescription>
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
};
