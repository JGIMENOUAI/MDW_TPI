import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <Box bg="gray.800" px={4} shadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="1200px" mx="auto">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Text fontSize="xl" fontWeight="bold" color="white">
            Sistema de Contratos
          </Text>
        </Link>

        <HStack gap={8}>
          <Link to="/personas" style={{ textDecoration: 'none' }}>
            <Text 
              color="white" 
              transition="color 0.3s"
              _hover={{ color: 'blue.400' }}
            >
              Personas
            </Text>
          </Link>
          <Link to="/inmuebles" style={{ textDecoration: 'none' }}>
            <Text 
              color="white" 
              transition="color 0.3s"
              _hover={{ color: 'blue.400' }}
            >
              Inmuebles
            </Text>
          </Link>
          <Link to="/contratos" style={{ textDecoration: 'none' }}>
            <Text 
              color="white" 
              transition="color 0.3s"
              _hover={{ color: 'blue.400' }}
            >
              Contratos
            </Text>
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
