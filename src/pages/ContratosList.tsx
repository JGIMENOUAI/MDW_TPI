import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { contratoService } from "../services/contratoService";
import type { Contrato } from "../types";
import { PageHeader } from "../components/PageHeader";
import { EmptyState } from "../components/EmptyState";
import { LoadingState } from "../components/LoadingState";
import { DataTable, type Column } from "../components/DataTable";
import { MobileCard } from "../components/MobileCard";
import { ConfirmDialog } from "../components/ConfirmDialog";

const ContratosList = () => {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contratoToDelete, setContratoToDelete] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null!);

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

  const handleDelete = async (id: string) => {
    setContratoToDelete(id);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!contratoToDelete) return;

    try {
      await contratoService.delete(contratoToDelete);
      loadContratos();
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al eliminar el contrato";
      alert(errorMessage);
      console.error(err);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-AR");
  };

  const getPersonaName = (
    persona: string | { nombreCompleto?: string },
  ): string => {
    if (typeof persona === "string") return persona;
    return persona?.nombreCompleto || "N/A";
  };

  const getInmuebleDesc = (
    inmueble: string | { descripcion?: string },
  ): string => {
    if (typeof inmueble === "string") return inmueble;
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
      header: "Acciones",
      accessor: (contrato) => (
        <Stack direction="row" spacing={2}>
          <Link to={`/contratos/editar/${contrato._id}`}>
            <Button
              size="sm"
              colorScheme="blue"
              minH="38px"
              leftIcon={<EditIcon />}
            >
              Editar
            </Button>
          </Link>
          <Button
            onClick={() => handleDelete(contrato._id!)}
            size="sm"
            colorScheme="red"
            variant="solid"
            minH="38px"
            leftIcon={<DeleteIcon />}
          >
            Eliminar
          </Button>
        </Stack>
      ),
      hideBelow: "md",
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
        title="Contratos"
        subtitle="Gestiona todos los contratos de alquiler y compraventa"
        actionButton={{
          label: "Nuevo Contrato",
          to: "/contratos/nuevo",
          icon: <AddIcon />,
        }}
      />

      {contratos.length === 0 ? (
        <EmptyState
          icon={<AddIcon boxSize={10} color="gray.400" />}
          title="No hay contratos registrados"
          description='Comienza creando un nuevo contrato haciendo clic en el botón "Nuevo Contrato".'
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

                  <Stack spacing={2} pt={2}>
                    <Link to={`/contratos/editar/${contrato._id}`}>
                      <Button
                        size="md"
                        colorScheme="blue"
                        w="full"
                        minH="48px"
                        leftIcon={<EditIcon />}
                      >
                        Editar
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleDelete(contrato._id!)}
                      size="md"
                      colorScheme="red"
                      variant="solid"
                      w="full"
                      minH="48px"
                      leftIcon={<DeleteIcon />}
                    >
                      Eliminar
                    </Button>
                  </Stack>
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

      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={confirmDelete}
        title="Eliminar Contrato"
        message="¿Estás seguro de que deseas eliminar este contrato? Esta acción no se puede deshacer."
        cancelRef={cancelRef}
      />
    </Box>
  );
};

export default ContratosList;
