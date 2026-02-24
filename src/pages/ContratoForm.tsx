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
  Spinner,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { contratoService } from "../services/contratoService";
import { inmuebleService } from "../services/inmuebleService";
import { personaService } from "../services/personaService";
import {
  contratoSchema,
  type ContratoFormData,
} from "../schemas/contratoSchema";
import type { Inmueble, Persona } from "../types";

const ContratoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ContratoFormData>({
    resolver: joiResolver(contratoSchema),
    defaultValues: {
      tipoContrato: "alquiler",
      locador: "",
      locatario: "",
      inmueble: "",
      fechaInicio: "",
      fechaFin: "",
      monto: 0,
    },
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (id && personas.length > 0 && inmuebles.length > 0) {
      loadContrato();
    }
  }, [id, personas, inmuebles]);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      const [personasData, inmueblesData] = await Promise.all([
        personaService.getAll(),
        inmuebleService.getAll(),
      ]);
      setPersonas(personasData);
      setInmuebles(inmueblesData);
      setError(null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al cargar los datos";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const loadContrato = async () => {
    try {
      const data = await contratoService.getById(id!);
      setValue("tipoContrato", data.tipoContrato);
      setValue(
        "locador",
        typeof data.locador === "string"
          ? data.locador
          : data.locador?._id || "",
      );
      setValue(
        "locatario",
        typeof data.locatario === "string"
          ? data.locatario
          : data.locatario?._id || "",
      );
      setValue(
        "inmueble",
        typeof data.inmueble === "string"
          ? data.inmueble
          : data.inmueble?._id || "",
      );
      setValue("fechaInicio", data.fechaInicio.split("T")[0]);
      setValue("fechaFin", data.fechaFin ? data.fechaFin.split("T")[0] : "");
      setValue("monto", data.monto);
      setError(null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al cargar el contrato";
      setError(errorMessage);
      console.error(err);
    }
  };

  const onSubmit = async (data: ContratoFormData) => {
    setLoading(true);
    setError(null);

    try {
      if (id) {
        await contratoService.update(id, data);
      } else {
        await contratoService.create(data);
      }
      navigate("/contratos");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al guardar el contrato";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData)
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" color="blue.500" />
      </Box>
    );

  return (
    <Box>
      <Heading mb={6} size="lg" color="white">
        {id ? "Editar Contrato" : "Nuevo Contrato"}
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
          <FormControl isRequired isInvalid={!!errors.tipoContrato}>
            <FormLabel color="gray.300">Tipo de Contrato</FormLabel>
            <Select
              {...register("tipoContrato")}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
            >
              <option value="alquiler" style={{ background: "#1A202C" }}>
                Alquiler
              </option>
              <option value="compraventa" style={{ background: "#1A202C" }}>
                Compraventa
              </option>
              <option value="comodato" style={{ background: "#1A202C" }}>
                Comodato
              </option>
            </Select>
            {errors.tipoContrato && (
              <FormErrorMessage>{errors.tipoContrato.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.locador}>
            <FormLabel color="gray.300">Locador</FormLabel>
            <Select
              {...register("locador")}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
            >
              <option value="" style={{ background: "#1A202C" }}>
                Seleccione un locador
              </option>
              {personas.map((persona) => (
                <option
                  key={persona._id}
                  value={persona._id}
                  style={{ background: "#1A202C" }}
                >
                  {persona.nombreCompleto} ({persona.documento})
                </option>
              ))}
            </Select>
            {errors.locador && (
              <FormErrorMessage>{errors.locador.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.locatario}>
            <FormLabel color="gray.300">Locatario</FormLabel>
            <Select
              {...register("locatario")}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
            >
              <option value="" style={{ background: "#1A202C" }}>
                Seleccione un locatario
              </option>
              {personas.map((persona) => (
                <option
                  key={persona._id}
                  value={persona._id}
                  style={{ background: "#1A202C" }}
                >
                  {persona.nombreCompleto} ({persona.documento})
                </option>
              ))}
            </Select>
            {errors.locatario && (
              <FormErrorMessage>{errors.locatario.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.inmueble}>
            <FormLabel color="gray.300">Inmueble</FormLabel>
            <Select
              {...register("inmueble")}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
            >
              <option value="" style={{ background: "#1A202C" }}>
                Seleccione un inmueble
              </option>
              {inmuebles.map((inmueble) => (
                <option
                  key={inmueble._id}
                  value={inmueble._id}
                  style={{ background: "#1A202C" }}
                >
                  {inmueble.descripcion} - {inmueble.ubicacion}
                </option>
              ))}
            </Select>
            {errors.inmueble && (
              <FormErrorMessage>{errors.inmueble.message}</FormErrorMessage>
            )}
          </FormControl>

          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <FormControl isRequired flex={1} isInvalid={!!errors.fechaInicio}>
              <FormLabel color="gray.300">Fecha de Inicio</FormLabel>
              <Input
                type="date"
                {...register("fechaInicio")}
                bg="gray.900"
                borderColor="gray.600"
                color="white"
                _hover={{ borderColor: "gray.500" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #3182CE",
                }}
              />
              {errors.fechaInicio && (
                <FormErrorMessage>
                  {errors.fechaInicio.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl flex={1} isInvalid={!!errors.fechaFin}>
              <FormLabel color="gray.300">Fecha de Fin (opcional)</FormLabel>
              <Input
                type="date"
                {...register("fechaFin")}
                bg="gray.900"
                borderColor="gray.600"
                color="white"
                _hover={{ borderColor: "gray.500" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #3182CE",
                }}
              />
              {errors.fechaFin && (
                <FormErrorMessage>{errors.fechaFin.message}</FormErrorMessage>
              )}
            </FormControl>
          </Stack>

          <FormControl isRequired isInvalid={!!errors.monto}>
            <FormLabel color="gray.300">Monto</FormLabel>
            <Controller
              name="monto"
              control={control}
              render={({ field: { onChange, value } }) => (
                <NumberInput
                  min={0}
                  value={value}
                  onChange={(valueString) =>
                    onChange(parseFloat(valueString) || 0)
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
            {errors.monto && (
              <FormErrorMessage>{errors.monto.message}</FormErrorMessage>
            )}
          </FormControl>

          <Stack direction={{ base: "column", sm: "row" }} spacing={4} pt={4}>
            <Button
              onClick={() => navigate("/contratos")}
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

export default ContratoForm;
