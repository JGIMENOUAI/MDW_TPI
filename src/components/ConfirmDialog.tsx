import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { type RefObject } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  cancelRef: RefObject<HTMLButtonElement>;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  cancelRef,
}: ConfirmDialogProps) => {
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay bg="blackAlpha.700" backdropFilter="blur(4px)">
        <AlertDialogContent
          bg="gray.800"
          borderColor="gray.700"
          border="1px"
          boxShadow="2xl"
          mx={4}
        >
          <AlertDialogHeader fontSize="xl" fontWeight="bold" color="white">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody color="gray.300" fontSize="md">
            {message}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
              minH="44px"
              variant="ghost"
              _hover={{ bg: "gray.700" }}
            >
              {cancelLabel}
            </Button>
            <Button
              colorScheme="red"
              onClick={onConfirm}
              ml={3}
              minH="44px"
              boxShadow="md"
              _hover={{
                transform: "translateY(-1px)",
                boxShadow: "lg",
              }}
            >
              {confirmLabel}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
