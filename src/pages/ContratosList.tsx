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
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contratoService } from "../services/contratoService";
import type { Contrato } from "../types";

const ContratosList = () => {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContratos();
  }, []);

  const loadContratos = async () => {
    try {
      setLoading(true);
      const data = await contratoService.getAll();
      setContratos(data);
      setError(null);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.mensaje || "Error al cargar los contratos";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este contrato?")) return;

    try {
      await contratoService.delete(id);
      loadContratos();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.mensaje || "Error al eliminar el contrato";
      alert(errorMessage);
      console.error(err);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-AR");
  };

  const getPersonaName = (persona: any): string => {
    if (typeof persona === "string") return persona;
    return persona?.nombreCompleto || "N/A";
  };

  const getInmuebleDesc = (inmueble: any): string => {
    if (typeof inmueble === "string") return inmueble;
    return inmueble?.descripcion || "N/A";
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
          Contratos
        </Heading>
        <Link to="/contratos/nuevo">
          <Button colorScheme="blue" w={{ base: "full", md: "auto" }}>
            Nuevo Contrato
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
              <Th color="gray.400">Locador</Th>
              <Th color="gray.400">Locatario</Th>
              <Th color="gray.400" display={{ base: "none", lg: "table-cell" }}>
                Inmueble
              </Th>
              <Th color="gray.400" display={{ base: "none", md: "table-cell" }}>
                Monto
              </Th>
              <Th color="gray.400" display={{ base: "none", lg: "table-cell" }}>
                Inicio
              </Th>
              <Th color="gray.400">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {contratos.map((contrato) => (
              <Tr key={contrato._id} _hover={{ bg: "gray.750" }}>
                <Td>
                  <Badge
                    colorScheme={
                      contrato.tipoContrato === "alquiler"
                        ? "green"
                        : contrato.tipoContrato === "compraventa"
                          ? "blue"
                          : "purple"
                    }
                    fontSize="xs"
                  >
                    {contrato.tipoContrato}
                  </Badge>
                </Td>
                <Td color="white">{getPersonaName(contrato.locador)}</Td>
                <Td color="white">{getPersonaName(contrato.locatario)}</Td>
                <Td
                  color="gray.300"
                  display={{ base: "none", lg: "table-cell" }}
                >
                  <Text noOfLines={1}>
                    {getInmuebleDesc(contrato.inmueble)}
                  </Text>
                </Td>
                <Td
                  color="gray.300"
                  display={{ base: "none", md: "table-cell" }}
                >
                  ${contrato.monto.toLocaleString()}
                </Td>
                <Td
                  color="gray.300"
                  display={{ base: "none", lg: "table-cell" }}
                >
                  {formatDate(contrato.fechaInicio)}
                </Td>
                <Td>
                  <Stack direction={{ base: "column", sm: "row" }} spacing={2}>
                    <Link to={`/contratos/editar/${contrato._id}`}>
                      <Button
                        size="sm"
                        colorScheme="yellow"
                        w={{ base: "full", sm: "auto" }}
                      >
                        Editar
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleDelete(contrato._id!)}
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
        {contratos.length === 0 && (
          <Box textAlign="center" py={8} color="gray.500">
            No hay contratos registrados
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ContratosList;
