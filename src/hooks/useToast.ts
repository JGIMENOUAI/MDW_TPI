import { useToast as useChakraToast } from "@chakra-ui/react";

export const useAppToast = () => {
  const toast = useChakraToast();

  const showSuccess = (message: string) => {
    toast({
      title: "Éxito",
      description: message,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
  };

  const showError = (message: string) => {
    toast({
      title: "Error",
      description: message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
  };

  const showWarning = (message: string) => {
    toast({
      title: "Advertencia",
      description: message,
      status: "warning",
      duration: 4000,
      isClosable: true,
      position: "top-right",
    });
  };

  const showInfo = (message: string) => {
    toast({
      title: "Información",
      description: message,
      status: "info",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
  };

  return { showSuccess, showError, showWarning, showInfo };
};
