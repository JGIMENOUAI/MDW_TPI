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
import { inmuebleService } from "../services/inmuebleService";
import type { Inmueble } from "../types";
import { PageHeader } from "../components/PageHeader";
import { EmptyState } from "../components/EmptyState";
import { LoadingState } from "../components/LoadingState";
import { DataTable, type Column } from "../components/DataTable";
import { MobileCard } from "../components/MobileCard";
import { ConfirmDialog } from "../components/ConfirmDialog";

const InmueblesList = () => {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inmuebleToDelete, setInmuebleToDelete] = useState<string | null>(null);
  const [inmuebleToDeactivate, setInmuebleToDeactivate] = useState<
    string | null
  >(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeactivateOpen,
    onOpen: onDeactivateOpen,
    onClose: onDeactivateClose,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null!);
  const deactivateCancelRef = useRef<HTMLButtonElement>(null!);

  useEffect(() => {
    loadInmuebles();
  }, []);

  const loadInmuebles = async () => {
    try {
      setLoading(true);
      const data = await inmuebleService.getAll();
      setInmuebles(data);
      setError(null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al cargar los inmuebles";
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
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al eliminar el inmueble";
      alert(errorMessage);
      console.error(err);
    }
  };

  const handleDesactivar = async (id: string) => {
    setInmuebleToDeactivate(id);
    onDeactivateOpen();
  };

  const confirmDeactivate = async () => {
    if (!inmuebleToDeactivate) return;

    try {
      await inmuebleService.desactivar(inmuebleToDeactivate);
      loadInmuebles();
      onDeactivateClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al desactivar el inmueble";
      alert(errorMessage);
      console.error(err);
    }
  };

  // Definición de columnas para la tabla
  const columns: Column<Inmueble>[] = [
    {
      header: "Tipo",
      accessor: "tipo",
      cell: (value) => (
        <Badge
          colorScheme="purple"
          fontSize="sm"
          px={3}
          py={1}
          borderRadius="full"
        >
          {value as string}
        </Badge>
      ),
    },
    {
      header: "Descripción",
      accessor: "descripcion",
      cell: (value) => (
        <Text color="white" fontWeight="medium" noOfLines={1}>
          {value as string}
        </Text>
      ),
    },
    {
      header: "Ubicación",
      accessor: "ubicacion",
      hideBelow: "md",
    },
    {
      header: "Hectáreas",
      accessor: (row) => row.hectareas || "-",
      hideBelow: "lg",
      isNumeric: true,
      cell: (value) => (
        <Text color="gray.300">{value !== "-" ? `${value} ha` : value}</Text>
      ),
    },
    {
      header: "Acciones",
      accessor: (row) => (
        <Stack direction="row" spacing={2}>
          <Link to={`/inmuebles/editar/${row._id}`}>
            <Button
              size="sm"
              colorScheme="yellow"
              minH="38px"
              leftIcon={<EditIcon />}
            >
              Editar
            </Button>
          </Link>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDesactivar(row._id!);
            }}
            size="sm"
            colorScheme="orange"
            minH="38px"
          >
            Desactivar
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row._id!);
            }}
            size="sm"
            colorScheme="red"
            minH="38px"
            leftIcon={<DeleteIcon />}
          >
            Eliminar
          </Button>
        </Stack>
      ),
    },
  ];

  if (loading) {
    return <LoadingState type="list" columns={5} rows={5} />;
  }

  if (error) {
    return (
      <Alert status="error" bg="red.900" color="white" borderRadius="xl">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box w="full">
      <PageHeader
        title="Inmuebles"
        subtitle="Administra todos los inmuebles y propiedades del sistema"
        actionButton={{
          label: "Nuevo Inmueble",
          to: "/inmuebles/nuevo",
          icon: <AddIcon />,
        }}
      />

      {inmuebles.length === 0 ? (
        <EmptyState
          icon={<AddIcon boxSize={10} color="gray.400" />}
          title="No hay inmuebles registrados"
          description="Comienza agregando un nuevo inmueble haciendo clic en el botón 'Nuevo Inmueble'."
        />
      ) : (
        <>
          {/* Mobile Cards View */}
          <SimpleGrid
            columns={1}
            spacing={4}
            display={{ base: "grid", md: "none" }}
          >
            {inmuebles.map((inmueble) => (
              <MobileCard key={inmueble._id}>
                <Stack direction="row" justify="space-between" align="center">
                  <Text
                    color="white"
                    fontWeight="bold"
                    fontSize="lg"
                    noOfLines={1}
                  >
                    {inmueble.descripcion}
                  </Text>
                  <Badge
                    colorScheme="purple"
                    fontSize="sm"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {inmueble.tipo}
                  </Badge>
                </Stack>

                <Box>
                  <Text color="gray.400" fontSize="sm" fontWeight="medium">
                    Ubicación
                  </Text>
                  <Text color="white" fontSize="md">
                    {inmueble.ubicacion}
                  </Text>
                </Box>

                <Box>
                  <Text color="gray.400" fontSize="sm" fontWeight="medium">
                    Hectáreas
                  </Text>
                  <Text color="white" fontSize="md">
                    {inmueble.hectareas ? `${inmueble.hectareas} ha` : "-"}
                  </Text>
                </Box>

                <Stack spacing={2} pt={3}>
                  <Link to={`/inmuebles/editar/${inmueble._id}`}>
                    <Button
                      size="md"
                      colorScheme="yellow"
                      w="full"
                      minH="48px"
                      leftIcon={<EditIcon />}
                    >
                      Editar
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleDesactivar(inmueble._id!)}
                    size="md"
                    colorScheme="orange"
                    w="full"
                    minH="48px"
                  >
                    Desactivar
                  </Button>
                  <Button
                    onClick={() => handleDelete(inmueble._id!)}
                    size="md"
                    colorScheme="red"
                    w="full"
                    minH="48px"
                    leftIcon={<DeleteIcon />}
                  >
                    Eliminar
                  </Button>
                </Stack>
              </MobileCard>
            ))}
          </SimpleGrid>

          {/* Desktop Table View */}
          <DataTable data={inmuebles} columns={columns} />
        </>
      )}

      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={confirmDelete}
        title="Eliminar Inmueble"
        message="¿Estás seguro de que deseas eliminar este inmueble? Esta acción no se puede deshacer."
        cancelRef={cancelRef}
      />

      <ConfirmDialog
        isOpen={isDeactivateOpen}
        onClose={onDeactivateClose}
        onConfirm={confirmDeactivate}
        title="Desactivar Inmueble"
        message="¿Estás seguro de que deseas desactivar este inmueble?"
        confirmLabel="Desactivar"
        cancelRef={deactivateCancelRef}
      />
    </Box>
  );
};

export default InmueblesList;
