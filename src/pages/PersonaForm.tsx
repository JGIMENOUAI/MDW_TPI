import {
    Alert,
    AlertIcon,
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Select,
    Stack,
    VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { personaService } from '../services/personaService';
import type { Persona } from '../types';

const PersonaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Persona, '_id'>>({
    tipoPersona: 'fisica',
    nombreCompleto: '',
    documento: '',
    email: '',
    telefono: '',
  });

  useEffect(() => {
    if (id) {
      loadPersona();
    }
  }, [id]);

  const loadPersona = async () => {
    try {
      const data = await personaService.getById(id!);
      setFormData({
        tipoPersona: data.tipoPersona,
        nombreCompleto: data.nombreCompleto,
        documento: data.documento,
        email: data.email,
        telefono: data.telefono,
      });
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.mensaje || 'Error al cargar la persona';
      setError(errorMessage);
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id) {
        await personaService.update(id, formData);
      } else {
        await personaService.create(formData);
      }
      navigate('/personas');
    } catch (err: any) {
      const errorMessage = err.response?.data?.mensaje || 'Error al guardar la persona';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box>
      <Heading mb={6} size="lg" color="white">{id ? 'Editar Persona' : 'Nueva Persona'}</Heading>

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
        p={{ base: 4, md: 6 }}
        borderRadius="md"
        border="1px"
        borderColor="gray.700"
      >
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel color="gray.300">Tipo de Persona</FormLabel>
            <Select
              name="tipoPersona"
              value={formData.tipoPersona}
              onChange={handleChange}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: 'gray.500' }}
            >
              <option value="fisica" style={{ background: '#1A202C' }}>Física</option>
              <option value="juridica" style={{ background: '#1A202C' }}>Jurídica</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel color="gray.300">Nombre Completo</FormLabel>
            <Input
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: 'gray.500' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182CE' }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel color="gray.300">Documento</FormLabel>
            <Input
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: 'gray.500' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182CE' }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel color="gray.300">Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: 'gray.500' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182CE' }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel color="gray.300">Teléfono</FormLabel>
            <Input
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: 'gray.500' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182CE' }}
            />
          </FormControl>

          <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} pt={4}>
            <Button
              onClick={() => navigate('/personas')}
              flex={1}
              bg="gray.700"
              color="white"
              _hover={{ bg: 'gray.600' }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={loading}
              flex={1}
            >
              Guardar
            </Button>
          </Stack>
        </VStack>
      </Box>
    </Box>
  );
};

export default PersonaForm;
