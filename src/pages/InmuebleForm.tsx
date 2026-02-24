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
import { inmuebleService } from "../services/inmuebleService";
import {
  inmuebleSchema,
  type InmuebleFormData,
} from "../schemas/inmuebleSchema";

const InmuebleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al cargar el inmueble";
      setError(errorMessage);
      console.error(err);
    }
  };

  const onSubmit = async (data: InmuebleFormData) => {
    setLoading(true);
    setError(null);

    try {
      if (id) {
        await inmuebleService.update(id, data);
      } else {
        await inmuebleService.create(data);
      }
      navigate("/inmuebles");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al guardar el inmueble";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Heading mb={6} size="lg" color="white">
        {id ? "Editar Inmueble" : "Nuevo Inmueble"}
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
          <FormControl isRequired isInvalid={!!errors.tipo}>
            <FormLabel color="gray.300">Tipo</FormLabel>
            <Select
              {...register("tipo")}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
            >
              <option value="casa" style={{ background: "#1A202C" }}>
                Casa
              </option>
              <option value="campo" style={{ background: "#1A202C" }}>
                Campo
              </option>
            </Select>
            {errors.tipo && (
              <FormErrorMessage>{errors.tipo.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.descripcion}>
            <FormLabel color="gray.300">Descripción</FormLabel>
            <Textarea
              {...register("descripcion")}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182CE",
              }}
              rows={4}
            />
            {errors.descripcion && (
              <FormErrorMessage>{errors.descripcion.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.ubicacion}>
            <FormLabel color="gray.300">Ubicación</FormLabel>
            <Input
              {...register("ubicacion")}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182CE",
              }}
            />
            {errors.ubicacion && (
              <FormErrorMessage>{errors.ubicacion.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.hectareas}>
            <FormLabel color="gray.300">Hectáreas (opcional)</FormLabel>
            <Controller
              name="hectareas"
              control={control}
              render={({ field: { onChange, value } }) => (
                <NumberInput
                  min={0}
                  value={value ?? ""}
                  onChange={(valueString) =>
                    onChange(valueString ? parseFloat(valueString) : undefined)
                  }
                >
                  <NumberInputField
                    bg="gray.900"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px #3182CE",
                    }}
                  />
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

export default InmuebleForm;
