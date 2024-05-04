
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { FC } from "react";
import { Button } from "./button";
  
  interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: VoidFunction;
    onLeftButtonClick: VoidFunction;
    onRightButtonClick?: VoidFunction
    title: string;
    message: string;
    rightButtonText?: string;
    leftButtonText: string;
  }
  
  export const ConfirmationModal: FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onLeftButtonClick,
    onRightButtonClick,
    title,
    message,
    rightButtonText,
    leftButtonText,
  }) => {
    const handleLeftButtonClick = () => {
      onLeftButtonClick();
      onClose();
    };
    const handleRightButtonClick = () => {
      onRightButtonClick &&  onRightButtonClick();
      onClose();
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>{message}</ModalBody>
          <ModalFooter className="justify-center flex">
            <Button onClick={handleLeftButtonClick}>
              {leftButtonText}
            </Button>
            {rightButtonText ? (<Button  onClick={handleRightButtonClick}>
              {rightButtonText}
            </Button>) : (<></>)}
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  