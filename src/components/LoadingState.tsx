import {
  Box,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";

interface LoadingStateProps {
  type: "list" | "form";
  columns?: number;
  rows?: number;
}

export const LoadingState = ({
  type,
  columns = 5,
  rows = 5,
}: LoadingStateProps) => {
  if (type === "form") {
    return (
      <Box
        bg="gray.800"
        p={{ base: 4, md: 6 }}
        borderRadius="xl"
        border="1px"
        borderColor="gray.700"
        boxShadow="xl"
      >
        <VStack spacing={6} align="stretch">
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i}>
              <Skeleton height="20px" width="120px" mb={2} />
              <Skeleton height="48px" borderRadius="md" />
            </Box>
          ))}
          <Skeleton height="48px" width="150px" borderRadius="md" />
        </VStack>
      </Box>
    );
  }

  return (
    <Box>
      <Stack
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        mb={8}
        pb={4}
        spacing={4}
      >
        <Skeleton height="40px" width="250px" />
        <Skeleton height="48px" width={{ base: "full", md: "180px" }} />
      </Stack>

      {/* Mobile Cards Skeleton */}
      <SimpleGrid
        columns={1}
        spacing={4}
        display={{ base: "grid", md: "none" }}
      >
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            bg="gray.800"
            borderRadius="xl"
            border="1px"
            borderColor="gray.700"
            p={5}
          >
            <VStack align="stretch" spacing={3}>
              <Stack direction="row" justify="space-between">
                <Skeleton height="24px" width="65%" />
                <Skeleton height="22px" width="70px" borderRadius="full" />
              </Stack>
              <SkeletonText noOfLines={3} spacing={3} />
              <Stack spacing={2} pt={2}>
                <Skeleton height="44px" borderRadius="md" />
                <Skeleton height="44px" borderRadius="md" />
                <Skeleton height="44px" borderRadius="md" />
              </Stack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {/* Desktop Table Skeleton */}
      <Box
        overflowX="auto"
        bg="gray.800"
        borderRadius="xl"
        border="1px"
        borderColor="gray.700"
        display={{ base: "none", md: "block" }}
        boxShadow="xl"
      >
        <Table variant="simple" size="lg">
          <Thead bg="gray.900">
            <Tr>
              {[...Array(columns)].map((_, i) => (
                <Th key={i} py={4}>
                  <Skeleton height="18px" width={`${60 + i * 20}px`} />
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {[...Array(rows)].map((_, i) => (
              <Tr key={i}>
                {[...Array(columns)].map((_, j) => (
                  <Td key={j} py={4}>
                    <Skeleton height="20px" width={`${80 + j * 30}px`} />
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};
