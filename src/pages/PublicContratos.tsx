import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { contratoService } from "../services/contratoService";
import type { Contrato } from "../types";
import { PageHeader } from "../components/PageHeader";
import { EmptyState } from "../components/EmptyState";
import { LoadingState } from "../components/LoadingState";
import { DataTable, type Column } from "../components/DataTable";
import { MobileCard } from "../components/MobileCard";

const PublicContratos = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
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

  const columns: Column<Contrato>[] = [
    {
      header: "Tipo",
      accessor: "tipoContrato",
      cell: (value) => (
        <Badge
          colorScheme={
            value === "alquiler"
              ? "green"
              : value === "compraventa"
                ? "blue"
                : "purple"
          }
          fontSize="xs"
        >
          {value as string}
        </Badge>
      ),
    },
    {
      header: "Locador",
      accessor: (contrato) => getPersonaName(contrato.locador),
    },
    {
      header: "Locatario",
      accessor: (contrato) => getPersonaName(contrato.locatario),
    },
    {
      header: "Inmueble",
      accessor: (contrato) => (
        <Text noOfLines={1}>{getInmuebleDesc(contrato.inmueble)}</Text>
      ),
      hideBelow: "lg",
    },
    {
      header: "Monto",
      accessor: (contrato) => `$${contrato.monto.toLocaleString()}`,
      hideBelow: "md",
    },
    {
      header: "Inicio",
      accessor: (contrato) => formatDate(contrato.fechaInicio),
      hideBelow: "lg",
    },
    {
      header: "Fin",
      accessor: (contrato) => formatDate(contrato.fechaFin),
      hideBelow: "lg",
    },
  ];

  if (loading) return <LoadingState type="list" />;

  if (error)
    return (
      <Alert status="error" bg="red.900" color="white" borderRadius="xl">
        <AlertIcon />
        {error}
      </Alert>
    );

  return (
    <Box w="full">
      <PageHeader
        title="Contratos Disponibles"
        subtitle="Visualización pública de contratos registrados"
      />

      {contratos.length === 0 ? (
        <EmptyState
          icon={<InfoIcon boxSize={10} color="gray.400" />}
          title="No hay contratos disponibles"
          description="Actualmente no hay contratos registrados en el sistema."
        />
      ) : (
        <>
          {/* Mobile Cards View */}
          <SimpleGrid
            columns={1}
            spacing={4}
            display={{ base: "grid", md: "none" }}
          >
            {contratos.map((contrato) => (
              <MobileCard key={contrato._id}>
                <Stack spacing={3}>
                  <Stack direction="row" justify="space-between" align="center">
                    <Text color="white" fontWeight="bold" fontSize="lg">
                      {getPersonaName(contrato.locador)}
                    </Text>
                    <Badge
                      colorScheme={
                        contrato.tipoContrato === "alquiler"
                          ? "green"
                          : contrato.tipoContrato === "compraventa"
                            ? "blue"
                            : "purple"
                      }
                      fontSize="sm"
                    >
                      {contrato.tipoContrato}
                    </Badge>
                  </Stack>

                  <Box>
                    <Text color="gray.400" fontSize="sm">
                      Locatario
                    </Text>
                    <Text color="white">
                      {getPersonaName(contrato.locatario)}
                    </Text>
                  </Box>

                  <Box>
                    <Text color="gray.400" fontSize="sm">
                      Inmueble
                    </Text>
                    <Text color="white">
                      {getInmuebleDesc(contrato.inmueble)}
                    </Text>
                  </Box>

                  <Box>
                    <Text color="gray.400" fontSize="sm">
                      Monto
                    </Text>
                    <Text color="white" fontSize="lg" fontWeight="bold">
                      ${contrato.monto.toLocaleString()}
                    </Text>
                  </Box>

                  <Box>
                    <Text color="gray.400" fontSize="sm">
                      Fecha de Inicio
                    </Text>
                    <Text color="white">
                      {formatDate(contrato.fechaInicio)}
                    </Text>
                  </Box>

                  {contrato.fechaFin && (
                    <Box>
                      <Text color="gray.400" fontSize="sm">
                        Fecha de Fin
                      </Text>
                      <Text color="white">{formatDate(contrato.fechaFin)}</Text>
                    </Box>
                  )}
                </Stack>
              </MobileCard>
            ))}
          </SimpleGrid>

          {/* Desktop Table View */}
          <Box display={{ base: "none", md: "block" }}>
            <DataTable data={contratos} columns={columns} />
          </Box>
        </>
      )}

      {!isAuthenticated && (
        <Box
          mt={6}
          p={4}
          bg="gray.800"
          borderRadius="xl"
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
      )}
    </Box>
  );
};

export default PublicContratos;
