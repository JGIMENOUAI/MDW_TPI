import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Heading,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { personaService } from '../services/personaService';
import type { Persona } from '../types';

const PersonasList = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    try {
      setLoading(true);
      const data = await personaService.getAll();
      setPersonas(data);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.mensaje || 'Error al cargar las personas';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta persona?')) return;

    try {
      await personaService.delete(id);
      loadPersonas();
    } catch (err: any) {
      const errorMessage = err.response?.data?.mensaje || 'Error al eliminar la persona';
      alert(errorMessage);
      console.error(err);
    }
  };

  if (loading) return (
    <Box textAlign="center" py={8}>
      <Spinner size="xl" color="blue.500" />
    </Box>
  );
  
  if (error)
    return (
      <Alert status="error" bg="red.900" color="white" borderRadius="md">
        <AlertIcon />
        {error}
      </Alert>
    );

  return (
    <Box>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align={{ base: 'stretch', md: 'center' }}
        mb={6}
        spacing={4}
      >
        <Heading size="lg" color="white">Personas</Heading>
        <Link to="/personas/nuevo">
          <Button colorScheme="blue" w={{ base: 'full', md: 'auto' }}>
            Nueva Persona
          </Button>
        </Link>
      </Stack>

      <Box overflowX="auto" bg="gray.800" borderRadius="md" border="1px" borderColor="gray.700">
        <Table variant="simple" size={{ base: 'sm', md: 'md' }}>
          <Thead bg="gray.900">
            <Tr>
              <Th color="gray.400">Tipo</Th>
              <Th color="gray.400">Nombre</Th>
              <Th color="gray.400" display={{ base: 'none', md: 'table-cell' }}>Documento</Th>
              <Th color="gray.400" display={{ base: 'none', lg: 'table-cell' }}>Email</Th>
              <Th color="gray.400" display={{ base: 'none', lg: 'table-cell' }}>Teléfono</Th>
              <Th color="gray.400">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {personas.map((persona) => (
              <Tr key={persona._id} _hover={{ bg: 'gray.750' }}>
                <Td>
                  <Badge colorScheme={persona.tipoPersona === 'fisica' ? 'green' : 'blue'} fontSize="xs">
                    {persona.tipoPersona}
                  </Badge>
                </Td>
                <Td color="white">{persona.nombreCompleto}</Td>
                <Td color="gray.300" display={{ base: 'none', md: 'table-cell' }}>{persona.documento}</Td>
                <Td color="gray.300" display={{ base: 'none', lg: 'table-cell' }}>{persona.email}</Td>
                <Td color="gray.300" display={{ base: 'none', lg: 'table-cell' }}>{persona.telefono}</Td>
                <Td>
                  <Stack direction={{ base: 'column', sm: 'row' }} spacing={2}>
                    <Link to={`/personas/editar/${persona._id}`}>
                      <Button size="sm" colorScheme="yellow" w={{ base: 'full', sm: 'auto' }}>
                        Editar
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleDelete(persona._id!)}
                      size="sm"
                      colorScheme="red"
                      w={{ base: 'full', sm: 'auto' }}
                    >
                      Eliminar
                    </Button>
                  </Stack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {personas.length === 0 && (
          <Box textAlign="center" py={8} color="gray.500">
            No hay personas registradas
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PersonasList;
