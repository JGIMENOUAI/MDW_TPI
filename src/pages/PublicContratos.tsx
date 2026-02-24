import {
  Alert,
  AlertIcon,
  Badge,
  Box,
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

const PublicContratos = () => {
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
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al cargar los contratos";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-AR");
  };

  const getPersonaName = (
    persona: string | { nombreCompleto?: string },
  ): string => {
    if (typeof persona === "string") return "N/A";
    return persona?.nombreCompleto || "N/A";
  };

  const getInmuebleDesc = (
    inmueble: string | { descripcion?: string },
  ): string => {
    if (typeof inmueble === "string") return "N/A";
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
        <Box>
          <Heading size="lg" color="white" mb={2}>
            Contratos Disponibles
          </Heading>
          <Text color="gray.400" fontSize="sm">
            Visualización pública de contratos registrados
          </Text>
        </Box>
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
              <Th color="gray.400" display={{ base: "none", lg: "table-cell" }}>
                Fin
              </Th>
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
                <Td
                  color="gray.300"
                  display={{ base: "none", lg: "table-cell" }}
                >
                  {formatDate(contrato.fechaFin)}
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

      <Box
        mt={6}
        p={4}
        bg="gray.800"
        borderRadius="md"
        border="1px"
        borderColor="gray.700"
      >
        <Text color="gray.400" fontSize="sm" textAlign="center">
          Para gestionar contratos, inmuebles y personas,{" "}
          <Link to="/login">
            <Text as="span" color="blue.400" textDecoration="underline">
              inicia sesión
            </Text>
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default PublicContratos;
