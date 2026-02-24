import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { personaService } from "../services/personaService";
import { personaSchema, type PersonaFormData } from "../schemas/personaSchema";

const PersonaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PersonaFormData>({
    resolver: joiResolver(personaSchema),
    defaultValues: {
      tipoPersona: "fisica",
      nombreCompleto: "",
      documento: "",
      email: "",
      telefono: "",
      activo: true,
    },
  });

  useEffect(() => {
    if (id) {
      loadPersona();
    }
  }, [id]);

  const loadPersona = async () => {
    try {
      const data = await personaService.getById(id!);
      setValue("tipoPersona", data.tipoPersona);
      setValue("nombreCompleto", data.nombreCompleto);
      setValue("documento", data.documento);
      setValue("email", data.email);
      setValue("telefono", data.telefono);
      setError(null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al cargar la persona";
      setError(errorMessage);
      console.error(err);
    }
  };

  const onSubmit = async (data: PersonaFormData) => {
    setLoading(true);
    setError(null);

    try {
      if (id) {
        await personaService.update(id, data);
      } else {
        await personaService.create(data);
      }
      navigate("/personas");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al guardar la persona";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Heading mb={6} size="lg" color="white">
        {id ? "Editar Persona" : "Nueva Persona"}
      </Heading>

      {error && (
        <Alert
          status="error"
          mb={4}
          bg="red.900"
          color="white"
          borderRadius="md"
        >
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Box
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        bg="gray.800"
        p={{ base: 4, md: 6 }}
        borderRadius="md"
        border="1px"
        borderColor="gray.700"
      >
        <VStack spacing={4} align="stretch">
          <FormControl isRequired isInvalid={!!errors.tipoPersona}>
            <FormLabel color="gray.300">Tipo de Persona</FormLabel>
            <Select
              {...register("tipoPersona")}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
            >
              <option value="fisica" style={{ background: "#1A202C" }}>
                Física
              </option>
              <option value="juridica" style={{ background: "#1A202C" }}>
                Jurídica
              </option>
            </Select>
            {errors.tipoPersona && (
              <FormErrorMessage>{errors.tipoPersona.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.nombreCompleto}>
            <FormLabel color="gray.300">Nombre Completo</FormLabel>
            <Input
              {...register("nombreCompleto")}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182CE",
              }}
            />
            {errors.nombreCompleto && (
              <FormErrorMessage>
                {errors.nombreCompleto.message}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.documento}>
            <FormLabel color="gray.300">Documento</FormLabel>
            <Input
              {...register("documento")}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182CE",
              }}
            />
            {errors.documento && (
              <FormErrorMessage>{errors.documento.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.email}>
            <FormLabel color="gray.300">Email</FormLabel>
            <Input
              type="email"
              {...register("email")}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182CE",
              }}
            />
            {errors.email && (
              <FormErrorMessage>{errors.email.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.telefono}>
            <FormLabel color="gray.300">Teléfono</FormLabel>
            <Input
              {...register("telefono")}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182CE",
              }}
            />
            {errors.telefono && (
              <FormErrorMessage>{errors.telefono.message}</FormErrorMessage>
            )}
          </FormControl>

          <Stack direction={{ base: "column", sm: "row" }} spacing={4} pt={4}>
            <Button
              onClick={() => navigate("/personas")}
              flex={1}
              bg="gray.700"
              color="white"
              _hover={{ bg: "gray.600" }}
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
