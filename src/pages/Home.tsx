import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box textAlign="center" py={8}>
      <Heading as="h1" size="2xl" mb={4}>
        Sistema de Gestión de Contratos
      </Heading>
      <Text fontSize="xl" color="gray.600" mb={12}>
        Administra personas, inmuebles y contratos de forma simple
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
        <Link to="/personas" style={{ textDecoration: 'none' }}>
          <Box
            p={8}
            border="2px"
            borderColor="gray.200"
            borderRadius="lg"
            transition="all 0.3s"
            _hover={{
              borderColor: 'blue.400',
              transform: 'translateY(-5px)',
              shadow: 'lg',
            }}
          >
            <Heading as="h2" size="lg" mb={2}>
              Personas
            </Heading>
            <Text color="gray.600">Gestiona personas físicas y jurídicas</Text>
          </Box>
        </Link>

        <Link to="/inmuebles" style={{ textDecoration: 'none' }}>
          <Box
            p={8}
            border="2px"
            borderColor="gray.200"
            borderRadius="lg"
            transition="all 0.3s"
            _hover={{
              borderColor: 'blue.400',
              transform: 'translateY(-5px)',
              shadow: 'lg',
            }}
          >
            <Heading as="h2" size="lg" mb={2}>
              Inmuebles
            </Heading>
            <Text color="gray.600">Administra casas y campos</Text>
          </Box>
        </Link>

        <Link to="/contratos" style={{ textDecoration: 'none' }}>
          <Box
            p={8}
            border="2px"
            borderColor="gray.200"
            borderRadius="lg"
            transition="all 0.3s"
            _hover={{
              borderColor: 'blue.400',
              transform: 'translateY(-5px)',
              shadow: 'lg',
            }}
          >
            <Heading as="h2" size="lg" mb={2}>
              Contratos
            </Heading>
            <Text color="gray.600">Registra y controla contratos</Text>
          </Box>
        </Link>
      </SimpleGrid>
    </Box>
  );
};

export default Home;
