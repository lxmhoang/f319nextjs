// import {
//     Button,
//     Modal,
//     ModalBody,
//     ModalContent,
//     ModalFooter,
//     ModalHeader,
//     ModalOverlay,
//   } from "@chakra-ui/react";
  import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { FC } from "react";
import { Button } from "./button";
  
  interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: VoidFunction;
    onConfirm: VoidFunction;
    title: string;
    message: string;
    confirmButtonText: string;
    cancelButtonText?: string;
  }
  
  export const ConfirmationModal: FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmButtonText,
    cancelButtonText,
  }) => {
    const handleConfirm = () => {
      onConfirm();
      onClose();
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>{message}</ModalBody>
          <ModalFooter>
            <Button onClick={handleConfirm}>
              {confirmButtonText}
            </Button>
            {cancelButtonText ? (<Button  onClick={onClose}>
              {cancelButtonText}
            </Button>) : (<></>)}
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };