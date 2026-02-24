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
import { personaService } from "../services/personaService";
import type { Persona } from "../types";
import { PageHeader } from "../components/PageHeader";
import { EmptyState } from "../components/EmptyState";
import { LoadingState } from "../components/LoadingState";
import { DataTable, type Column } from "../components/DataTable";
import { MobileCard } from "../components/MobileCard";
import { ConfirmDialog } from "../components/ConfirmDialog";

const PersonasList = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [personaToDelete, setPersonaToDelete] = useState<string | null>(null);
  const [personaToDeactivate, setPersonaToDeactivate] = useState<string | null>(
    null,
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeactivateOpen,
    onOpen: onDeactivateOpen,
    onClose: onDeactivateClose,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null!);
  const deactivateCancelRef = useRef<HTMLButtonElement>(null!);

  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    try {
      setLoading(true);
      const data = await personaService.getAll();
      setPersonas(data);
      setError(null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al cargar las personas";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setPersonaToDelete(id);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!personaToDelete) return;

    try {
      await personaService.delete(personaToDelete);
      loadPersonas();
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al eliminar la persona";
      alert(errorMessage);
      console.error(err);
    }
  };

  const handleDesactivar = async (id: string) => {
    setPersonaToDeactivate(id);
    onDeactivateOpen();
  };

  const confirmDeactivate = async () => {
    if (!personaToDeactivate) return;

    try {
      await personaService.desactivar(personaToDeactivate);
      loadPersonas();
      onDeactivateClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al desactivar la persona";
      alert(errorMessage);
      console.error(err);
    }
  };

  // Definición de columnas para la tabla
  const columns: Column<Persona>[] = [
    {
      header: "Tipo",
      accessor: "tipoPersona",
      cell: (value) => (
        <Badge
          colorScheme={value === "fisica" ? "green" : "blue"}
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
      header: "Nombre Completo",
      accessor: "nombreCompleto",
      cell: (value) => (
        <Text color="white" fontWeight="medium">
          {value as string}
        </Text>
      ),
    },
    {
      header: "Documento",
      accessor: "documento",
      hideBelow: "md",
    },
    {
      header: "Email",
      accessor: "email",
      hideBelow: "lg",
    },
    {
      header: "Teléfono",
      accessor: "telefono",
      hideBelow: "lg",
    },
    {
      header: "Acciones",
      accessor: (row) => (
        <Stack direction="row" spacing={2}>
          <Link to={`/personas/editar/${row._id}`}>
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
    return <LoadingState type="list" columns={6} rows={5} />;
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
        title="Personas"
        subtitle="Gestiona todas las personas físicas y jurídicas del sistema"
        actionButton={{
          label: "Nueva Persona",
          to: "/personas/nuevo",
          icon: <AddIcon />,
        }}
      />

      {personas.length === 0 ? (
        <EmptyState
          icon={<AddIcon boxSize={10} color="gray.400" />}
          title="No hay personas registradas"
          description="Comienza agregando una nueva persona física o jurídica haciendo clic en el botón 'Nueva Persona'."
        />
      ) : (
        <>
          {/* Mobile Cards View */}
          <SimpleGrid
            columns={1}
            spacing={4}
            display={{ base: "grid", md: "none" }}
          >
            {personas.map((persona) => (
              <MobileCard key={persona._id}>
                <Stack direction="row" justify="space-between" align="center">
                  <Text color="white" fontWeight="bold" fontSize="lg">
                    {persona.nombreCompleto}
                  </Text>
                  <Badge
                    colorScheme={
                      persona.tipoPersona === "fisica" ? "green" : "blue"
                    }
                    fontSize="sm"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {persona.tipoPersona}
                  </Badge>
                </Stack>

                <Box>
                  <Text color="gray.400" fontSize="sm" fontWeight="medium">
                    Documento
                  </Text>
                  <Text color="white" fontSize="md">
                    {persona.documento}
                  </Text>
                </Box>

                <Box>
                  <Text color="gray.400" fontSize="sm" fontWeight="medium">
                    Email
                  </Text>
                  <Text color="white" fontSize="sm">
                    {persona.email}
                  </Text>
                </Box>

                <Box>
                  <Text color="gray.400" fontSize="sm" fontWeight="medium">
                    Teléfono
                  </Text>
                  <Text color="white" fontSize="md">
                    {persona.telefono}
                  </Text>
                </Box>

                <Stack spacing={2} pt={3}>
                  <Link to={`/personas/editar/${persona._id}`}>
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
                    onClick={() => handleDesactivar(persona._id!)}
                    size="md"
                    colorScheme="orange"
                    w="full"
                    minH="48px"
                  >
                    Desactivar
                  </Button>
                  <Button
                    onClick={() => handleDelete(persona._id!)}
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
          <DataTable data={personas} columns={columns} />
        </>
      )}

      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={confirmDelete}
        title="Eliminar Persona"
        message="¿Estás seguro de que deseas eliminar esta persona? Esta acción no se puede deshacer."
        cancelRef={cancelRef}
      />

      <ConfirmDialog
        isOpen={isDeactivateOpen}
        onClose={onDeactivateClose}
        onConfirm={confirmDeactivate}
        title="Desactivar Persona"
        message="¿Estás seguro de que deseas desactivar esta persona?"
        confirmLabel="Desactivar"
        cancelRef={deactivateCancelRef}
      />
    </Box>
  );
};

export default PersonasList;
