import { Box, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <VStack spacing={8} py={8}>
      <Box textAlign="center">
        <Heading size="lg" mb={2} color="white">
          Sistema de Contratos
        </Heading>
        <Text color="gray.400" fontSize="sm">
          Gestión simple de personas, inmuebles y contratos
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
        <Link to="/personas" style={{ textDecoration: 'none' }}>
          <Box
            p={6}
            bg="gray.800"
            borderRadius="md"
            border="1px"
            borderColor="gray.700"
            transition="all 0.2s"
            _hover={{ borderColor: 'blue.500', bg: 'gray.750' }}
            textAlign="center"
          >
            <Heading size="md" mb={2} color="white">
              Personas
            </Heading>
            <Text color="gray.400" fontSize="sm">
              Gestionar personas
            </Text>
          </Box>
        </Link>

        <Link to="/inmuebles" style={{ textDecoration: 'none' }}>
          <Box
            p={6}
            bg="gray.800"
            borderRadius="md"
            border="1px"
            borderColor="gray.700"
            transition="all 0.2s"
            _hover={{ borderColor: 'blue.500', bg: 'gray.750' }}
            textAlign="center"
          >
            <Heading size="md" mb={2} color="white">
              Inmuebles
            </Heading>
            <Text color="gray.400" fontSize="sm">
              Administrar inmuebles
            </Text>
          </Box>
        </Link>

        <Link to="/contratos" style={{ textDecoration: 'none' }}>
          <Box
            p={6}
            bg="gray.800"
            borderRadius="md"
            border="1px"
            borderColor="gray.700"
            transition="all 0.2s"
            _hover={{ borderColor: 'blue.500', bg: 'gray.750' }}
            textAlign="center"
          >
            <Heading size="md" mb={2} color="white">
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
