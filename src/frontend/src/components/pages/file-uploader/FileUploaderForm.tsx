import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { postVideo, useAppDispatch } from "../../../redux";

export const FileUploaderForm = ({ isFetching }) => {
  const {
    register,
    handleSubmit,
    formState: { isDirty: isFormChanged },
  } = useForm();
  const dispatch = useAppDispatch();

  const onSumbitForm = (data: any) => {
    if (!isFormChanged) {
      return;
    }
    const fd = new FormData();
    fd.set("video", data["video"][0] as File);
    dispatch(postVideo(fd));
  };

  return (
    <Center position="absolute" top="40vh" width={"100%"}>
      <Box padding="5px" borderWidth="2px" borderRadius="lg" overflow="hidden">
        <form onSubmit={handleSubmit(onSumbitForm)}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Файл</FormLabel>
              <Input
                {...register("video")}
                isDisabled={isFetching}
                type="file"
                multiple={false}
              />
            </FormControl>

            <Button type="submit" isLoading={isFetching} colorScheme="teal">
              Отправить
            </Button>
          </VStack>
        </form>
      </Box>
    </Center>
  );
};
