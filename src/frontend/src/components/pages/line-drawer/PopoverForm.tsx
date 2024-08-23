import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { Form } from "./Form";
import { DataTypes } from "../../../types";
import { useAppDispatch, addLine } from "../../../redux";

export const PopoverForm = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const firstFieldRef = useRef(null);

  const addNewLine = (data: DataTypes.Line) => {
    dispatch(addLine(data));
    onClose();
  };

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <Form onCancel={onClose} onSubmit={addNewLine} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
