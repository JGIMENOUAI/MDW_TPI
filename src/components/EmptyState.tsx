import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { type ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const EmptyState = ({ icon, title, description }: EmptyStateProps) => {
  return (
    <Box
      textAlign="center"
      py={12}
      px={6}
      bg="gray.800"
      borderRadius="xl"
      border="2px dashed"
      borderColor="gray.700"
    >
      <VStack spacing={4}>
        <Box bg="gray.700" borderRadius="full" p={5} display="inline-flex">
          {icon}
        </Box>
        <Heading size="md">{title}</Heading>
        <Text color="gray.400" maxW="md" fontSize="sm" lineHeight="tall">
          {description}
        </Text>
      </VStack>
    </Box>
  );
};
