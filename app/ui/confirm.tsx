
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { FC } from "react";
import { Button } from "./button";


export const initAlertState: AlertModal = {
  isShown: false,
  title: '',
  message: '',
  leftBtnTitle: '',
  leftBtnClick: () => { }
}

export type AlertModal = {
  isShown: boolean
  title: string
  message: string
  leftBtnTitle: string,
  rightBtntitle?: string,
  leftBtnClick: VoidFunction,
  rightBtnClick?: VoidFunction
}

  
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
      onClose();
      onLeftButtonClick();
    };
    const handleRightButtonClick = () => {
      onClose();
      onRightButtonClick &&  onRightButtonClick();
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          <ModalHeader className="mx-auto">{title}</ModalHeader>
          <ModalBody>{message}</ModalBody>
          <ModalFooter className="justify-evenly flex mb-4">
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

  