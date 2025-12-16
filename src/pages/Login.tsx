import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Heading mb={6} size="lg" textAlign="center" color="white">
        Iniciar Sesión
      </Heading>

      {error && (
        <Alert status="error" mb={4} bg="red.900" color="white" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="gray.800"
        p={6}
        borderRadius="md"
        border="1px"
        borderColor="gray.700"
      >
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel color="gray.300">Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: 'gray.500' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182CE' }}
              placeholder="correo@ejemplo.com"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            w="full"
            mt={2}
          >
            Ingresar
          </Button>
        </VStack>
      </Box>

      <Box textAlign="center" mt={4} color="gray.400" fontSize="sm">
        Sistema de autenticación con Firebase
      </Box>
    </Box>
  );
};

export default Login;
