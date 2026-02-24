import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { inmuebleService } from "../services/inmuebleService";
import type { Inmueble } from "../types";

const InmueblesList = () => {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inmuebleToDelete, setInmuebleToDelete] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    loadInmuebles();
  }, []);

  const loadInmuebles = async () => {
    try {
      setLoading(true);
      const data = await inmuebleService.getAll();
      setInmuebles(data);
      setError(null);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.mensaje || "Error al cargar los inmuebles";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setInmuebleToDelete(id);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!inmuebleToDelete) return;

    try {
      await inmuebleService.delete(inmuebleToDelete);
      loadInmuebles();
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        (err as any).response?.data?.mensaje || "Error al eliminar el inmueble";
      alert(errorMessage);
      console.error(err);
    }
  };

  const handleDesactivar = async (id: string) => {
    try {
      await inmuebleService.desactivar(id);
      loadInmuebles();
    } catch (err: unknown) {
      const errorMessage =
        (err as any).response?.data?.mensaje ||
        "Error al desactivar el inmueble";
      alert(errorMessage);
      console.error(err);
    }
  };

  if (loading)
    return (
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
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        mb={6}
        spacing={4}
      >
        <Heading size="lg" color="white">
          Inmuebles
        </Heading>
        <Link to="/inmuebles/nuevo">
          <Button colorScheme="blue" w={{ base: "full", md: "auto" }}>
            Nuevo Inmueble
          </Button>
        </Link>
      </Stack>

      <Box
        overflowX="auto"
        bg="gray.800"
        borderRadius="md"
        border="1px"
        borderColor="gray.700"
      >
        <Table variant="simple" size={{ base: "sm", md: "md" }}>
          <Thead bg="gray.900">
            <Tr>
              <Th color="gray.400">Tipo</Th>
              <Th color="gray.400">Descripción</Th>
              <Th color="gray.400" display={{ base: "none", md: "table-cell" }}>
                Ubicación
              </Th>
              <Th color="gray.400" display={{ base: "none", lg: "table-cell" }}>
                Hectáreas
              </Th>
              <Th color="gray.400">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {inmuebles.map((inmueble) => (
              <Tr key={inmueble._id} _hover={{ bg: "gray.750" }}>
                <Td>
                  <Badge
                    colorScheme={inmueble.tipo === "casa" ? "purple" : "orange"}
                    fontSize="xs"
                  >
                    {inmueble.tipo}
                  </Badge>
                </Td>
                <Td color="white">{inmueble.descripcion}</Td>
                <Td
                  color="gray.300"
                  display={{ base: "none", md: "table-cell" }}
                >
                  {inmueble.ubicacion}
                </Td>
                <Td
                  color="gray.300"
                  display={{ base: "none", lg: "table-cell" }}
                >
                  {inmueble.hectareas ? `${inmueble.hectareas} ha` : "-"}
                </Td>
                <Td>
                  <Stack direction={{ base: "column", sm: "row" }} spacing={2}>
                    <Link to={`/inmuebles/editar/${inmueble._id}`}>
                      <Button
                        size="sm"
                        colorScheme="yellow"
                        w={{ base: "full", sm: "auto" }}
                      >
                        Editar
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleDesactivar(inmueble._id!)}
                      size="sm"
                      colorScheme="orange"
                      w={{ base: "full", sm: "auto" }}
                    >
                      Desactivar
                    </Button>
                    <Button
                      onClick={() => handleDelete(inmueble._id!)}
                      size="sm"
                      colorScheme="red"
                      w={{ base: "full", sm: "auto" }}
                    >
                      Eliminar
                    </Button>
                  </Stack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {inmuebles.length === 0 && (
          <Box textAlign="center" py={8} color="gray.500">
            No hay inmuebles registrados
          </Box>
        )}
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800" borderColor="gray.700">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="white">
              Eliminar Inmueble
            </AlertDialogHeader>

            <AlertDialogBody color="gray.300">
              ¿Estás seguro de que deseas eliminar este inmueble? Esta acción no
              se puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default InmueblesList;
