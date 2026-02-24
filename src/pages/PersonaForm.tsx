import {
  Box,
  Button,
  Fade,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAppToast } from "../hooks/useToast";
import { personaService } from "../services/personaService";
import { personaSchema, type PersonaFormData } from "../schemas/personaSchema";
import { PageHeader } from "../components/PageHeader";
import { CARD_STYLES } from "../styles/constants";

const PersonaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAppToast();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadPersona = async () => {
    try {
      const data = await personaService.getById(id!);
      setValue("tipoPersona", data.tipoPersona);
      setValue("nombreCompleto", data.nombreCompleto);
      setValue("documento", data.documento);
      setValue("email", data.email);
      setValue("telefono", data.telefono);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al cargar la persona";
      showError(errorMessage);
      console.error(err);
    }
  };

  const onSubmit = async (data: PersonaFormData) => {
    setLoading(true);

    try {
      if (id) {
        await personaService.update(id, data);
        showSuccess("Persona actualizada correctamente");
      } else {
        await personaService.create(data);
        showSuccess("Persona creada correctamente");
      }
      navigate("/personas");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al guardar la persona";
      showError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in={true}>
      <Box w="full">
        <PageHeader
          title={id ? "Editar Persona" : "Nueva Persona"}
          subtitle={
            id
              ? "Actualiza los datos de la persona"
              : "Registra una nueva persona física o jurídica"
          }
        />

        <Box as="form" onSubmit={handleSubmit(onSubmit)} {...CARD_STYLES}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired isInvalid={!!errors.tipoPersona}>
              <FormLabel>Tipo de Persona</FormLabel>
              <Select {...register("tipoPersona")}>
                <option value="fisica">Física</option>
                <option value="juridica">Jurídica</option>
              </Select>
              {errors.tipoPersona && (
                <FormErrorMessage>
                  {errors.tipoPersona.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.nombreCompleto}>
              <FormLabel>Nombre Completo</FormLabel>
              <Input {...register("nombreCompleto")} />
              {errors.nombreCompleto && (
                <FormErrorMessage>
                  {errors.nombreCompleto.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.documento}>
              <FormLabel>Documento</FormLabel>
              <Input {...register("documento")} />
              {errors.documento && (
                <FormErrorMessage>{errors.documento.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input type="email" {...register("email")} />
              {errors.email && (
                <FormErrorMessage>{errors.email.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.telefono}>
              <FormLabel>Teléfono</FormLabel>
              <Input {...register("telefono")} />
              {errors.telefono && (
                <FormErrorMessage>{errors.telefono.message}</FormErrorMessage>
              )}
            </FormControl>

            <Stack direction={{ base: "column", sm: "row" }} spacing={4} pt={4}>
              <Button
                onClick={() => navigate("/personas")}
                flex={1}
                variant="secondary"
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
    </Fade>
  );
};

export default PersonaForm;
