import { Box, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { CARD_STYLES } from "../styles/constants";

const homeCardStyles = {
  ...CARD_STYLES,
  minH: "140px",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "center",
  textAlign: "center" as const,
  transition: "all 0.2s",
  _hover: { borderColor: "blue.500", bg: "gray.750" },
};

const Home = () => {
  return (
    <VStack spacing={8} w="full">
      <Box w="full">
        <PageHeader
          title="Sistema de Contratos"
          subtitle="Gestión simple de personas, inmuebles y contratos"
        />
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} w="full">
        <Link to="/personas" style={{ textDecoration: "none" }}>
          <Box {...homeCardStyles}>
            <Heading size="md" mb={2}>
              Personas
            </Heading>
            <Text color="gray.400" fontSize="sm">
              Gestionar personas
            </Text>
          </Box>
        </Link>

        <Link to="/inmuebles" style={{ textDecoration: "none" }}>
          <Box {...homeCardStyles}>
            <Heading size="md" mb={2}>
              Inmuebles
            </Heading>
            <Text color="gray.400" fontSize="sm">
              Administrar inmuebles
            </Text>
          </Box>
        </Link>

        <Link to="/contratos" style={{ textDecoration: "none" }}>
          <Box {...homeCardStyles}>
            <Heading size="md" mb={2}>
              Contratos
            </Heading>
            <Text color="gray.400" fontSize="sm">
              Registrar contratos
            </Text>
          </Box>
        </Link>
      </SimpleGrid>
    </VStack>
  );
};

export default Home;
