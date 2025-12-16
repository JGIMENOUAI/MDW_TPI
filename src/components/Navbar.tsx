import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box bg="gray.800" px={4} borderBottom="1px" borderColor="gray.700">
      <Flex h={14} alignItems="center" justifyContent="space-between" maxW="1200px" mx="auto">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Text fontSize="lg" fontWeight="bold" color="white">
            Contratos
          </Text>
        </Link>

        <HStack spacing={{ base: 3, md: 6 }} fontSize={{ base: 'sm', md: 'md' }}>
          {isAuthenticated ? (
            <>
              <Link to="/personas" style={{ textDecoration: 'none' }}>
                <Text color="gray.300" _hover={{ color: 'white' }} transition="color 0.2s">
                  Personas
                </Text>
              </Link>
              <Link to="/inmuebles" style={{ textDecoration: 'none' }}>
                <Text color="gray.300" _hover={{ color: 'white' }} transition="color 0.2s">
                  Inmuebles
                </Text>
              </Link>
              <Link to="/contratos" style={{ textDecoration: 'none' }}>
                <Text color="gray.300" _hover={{ color: 'white' }} transition="color 0.2s">
                  Contratos
                </Text>
              </Link>
              <Text color="gray.400" fontSize="xs" display={{ base: 'none', md: 'block' }}>
                {user?.email}
              </Text>
              <Button
                size="sm"
                colorScheme="red"
                onClick={handleLogout}
                variant="outline"
              >
                Salir
              </Button>
            </>
          ) : (
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button size="sm" colorScheme="blue">
                Ingresar
              </Button>
            </Link>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
