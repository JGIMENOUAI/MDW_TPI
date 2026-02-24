import {
  Box,
  Button,
  Fade,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAppToast } from "../hooks/useToast";
import { inmuebleService } from "../services/inmuebleService";
import {
  inmuebleSchema,
  type InmuebleFormData,
} from "../schemas/inmuebleSchema";
import { PageHeader } from "../components/PageHeader";
import { CARD_STYLES, INPUT_STYLES } from "../styles/constants";

const InmuebleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAppToast();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<InmuebleFormData>({
    resolver: joiResolver(inmuebleSchema),
    defaultValues: {
      tipo: "casa",
      descripcion: "",
      ubicacion: "",
      hectareas: undefined,
      activo: true,
    },
  });

  useEffect(() => {
    if (id) {
      loadInmueble();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadInmueble = async () => {
    try {
      const data = await inmuebleService.getById(id!);
      setValue("tipo", data.tipo);
      setValue("descripcion", data.descripcion);
      setValue("ubicacion", data.ubicacion);
      if (data.hectareas !== undefined) {
        setValue("hectareas", data.hectareas);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al cargar el inmueble";
      showError(errorMessage);
      console.error(err);
    }
  };

  const onSubmit = async (data: InmuebleFormData) => {
    setLoading(true);

    try {
      if (id) {
        await inmuebleService.update(id, data);
        showSuccess("Inmueble actualizado correctamente");
      } else {
        await inmuebleService.create(data);
        showSuccess("Inmueble creado correctamente");
      }
      navigate("/inmuebles");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al guardar el inmueble";
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
          title={id ? "Editar Inmueble" : "Nuevo Inmueble"}
          subtitle={
            id
              ? "Actualiza los datos del inmueble"
              : "Registra un nuevo inmueble o propiedad"
          }
        />

        <Box as="form" onSubmit={handleSubmit(onSubmit)} {...CARD_STYLES}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired isInvalid={!!errors.tipo}>
              <FormLabel>Tipo</FormLabel>
              <Select {...register("tipo")}>
                <option value="casa">Casa</option>
                <option value="campo">Campo</option>
              </Select>
              {errors.tipo && (
                <FormErrorMessage>{errors.tipo.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.descripcion}>
              <FormLabel>Descripción</FormLabel>
              <Textarea {...register("descripcion")} rows={4} />
              {errors.descripcion && (
                <FormErrorMessage>
                  {errors.descripcion.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.ubicacion}>
              <FormLabel>Ubicación</FormLabel>
              <Input {...register("ubicacion")} />
              {errors.ubicacion && (
                <FormErrorMessage>{errors.ubicacion.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.hectareas}>
              <FormLabel>Hectáreas (opcional)</FormLabel>
              <Controller
                name="hectareas"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <NumberInput
                    min={0}
                    value={value ?? ""}
                    onChange={(valueString) =>
                      onChange(
                        valueString ? parseFloat(valueString) : undefined,
                      )
                    }
                  >
                    <NumberInputField {...INPUT_STYLES} />
                  </NumberInput>
                )}
              />
              {errors.hectareas && (
                <FormErrorMessage>{errors.hectareas.message}</FormErrorMessage>
              )}
            </FormControl>

            <Stack direction={{ base: "column", sm: "row" }} spacing={4} pt={4}>
              <Button
                onClick={() => navigate("/inmuebles")}
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

export default InmuebleForm;
