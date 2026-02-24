import { Box, VStack } from "@chakra-ui/react";
import { type ReactNode } from "react";
import { CARD_STYLES } from "../styles/constants";

interface MobileCardProps {
  children: ReactNode;
  onClick?: () => void;
}

export const MobileCard = ({ children, onClick }: MobileCardProps) => {
  return (
    <Box
      {...CARD_STYLES}
      cursor={onClick ? "pointer" : "default"}
      onClick={onClick}
      _hover={
        onClick
          ? {
              borderColor: "gray.600",
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }
          : undefined
      }
      transition="all 0.15s"
    >
      <VStack align="stretch" spacing={4}>
        {children}
      </VStack>
    </Box>
  );
};
