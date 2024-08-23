import {
  Stack,
  ButtonGroup,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { DataTypes } from "../../../types";

export const Form = ({ onCancel, onSubmit }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: { id: "", points: [50, 50, 200, 50] } as DataTypes.Line,
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Название поворота</FormLabel>
          <Input {...register("id")} min={3} />
        </FormControl>
        <ButtonGroup display="flex" justifyContent="flex-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button colorScheme="teal" type="submit">
            Save
          </Button>
        </ButtonGroup>
      </Stack>
    </form>
  );
};
