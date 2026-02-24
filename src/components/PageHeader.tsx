import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { type ReactElement } from "react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: {
    label: string;
    to: string;
    icon?: ReactElement;
  };
}

export const PageHeader = ({
  title,
  subtitle,
  actionButton,
}: PageHeaderProps) => {
  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      justify="space-between"
      align={{ base: "stretch", md: "center" }}
      mb={6}
      spacing={4}
      pb={5}
      borderBottom="1px"
      borderColor="gray.700"
    >
      <Box>
        <Heading size="lg">{title}</Heading>
        {subtitle && (
          <Text color="gray.400" fontSize="sm" mt={1.5}>
            {subtitle}
          </Text>
        )}
      </Box>
      {actionButton && (
        <Link to={actionButton.to}>
          <Button
            colorScheme="blue"
            w={{ base: "full", md: "auto" }}
            leftIcon={actionButton.icon}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            transition="all 0.2s"
          >
            {actionButton.label}
          </Button>
        </Link>
      )}
    </Stack>
  );
};
