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
  Spinner,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAppToast } from "../hooks/useToast";
import { contratoService } from "../services/contratoService";
import { inmuebleService } from "../services/inmuebleService";
import { personaService } from "../services/personaService";
import {
  contratoSchema,
  type ContratoFormData,
} from "../schemas/contratoSchema";
import type { Inmueble, Persona } from "../types";
import { PageHeader } from "../components/PageHeader";
import { CARD_STYLES, INPUT_STYLES } from "../styles/constants";

const ContratoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const { showSuccess, showError } = useAppToast();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id && personas.length > 0 && inmuebles.length > 0) {
      loadContrato();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al cargar los datos";
      showError(errorMessage);
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
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al cargar el contrato";
      showError(errorMessage);
      console.error(err);
    }
  };

  const onSubmit = async (data: ContratoFormData) => {
    setLoading(true);

    try {
      // Convertir fechas a string si son Date
      const dataToSend = {
        ...data,
        fechaInicio:
          data.fechaInicio instanceof Date
            ? data.fechaInicio.toISOString().split("T")[0]
            : data.fechaInicio,
        fechaFin:
          data.fechaFin instanceof Date
            ? data.fechaFin.toISOString().split("T")[0]
            : data.fechaFin || "",
      };

      if (id) {
        await contratoService.update(id, dataToSend);
        showSuccess("Contrato actualizado correctamente");
      } else {
        await contratoService.create(dataToSend);
        showSuccess("Contrato creado correctamente");
      }
      navigate("/contratos");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      const errorMessage =
        error.response?.data?.mensaje || "Error al guardar el contrato";
      showError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData)
    return (
      <Fade in={true}>
        <Box textAlign="center" py={8}>
          <Spinner size="xl" color="blue.500" />
        </Box>
      </Fade>
    );

  return (
    <Fade in={true}>
      <Box w="full">
        <PageHeader
          title={id ? "Editar Contrato" : "Nuevo Contrato"}
          subtitle={
            id
              ? "Actualiza los datos del contrato"
              : "Crea un nuevo contrato de alquiler o compraventa"
          }
        />

        <Box as="form" onSubmit={handleSubmit(onSubmit)} {...CARD_STYLES}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired isInvalid={!!errors.tipoContrato}>
              <FormLabel>Tipo de Contrato</FormLabel>
              <Select {...register("tipoContrato")}>
                <option value="alquiler">Alquiler</option>
                <option value="compraventa">Compraventa</option>
              </Select>
              {errors.tipoContrato && (
                <FormErrorMessage>
                  {errors.tipoContrato.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.locador}>
              <FormLabel>Locador</FormLabel>
              <Select {...register("locador")}>
                <option value="">Seleccione un locador</option>
                {personas.map((persona) => (
                  <option key={persona._id} value={persona._id}>
                    {persona.nombreCompleto} ({persona.documento})
                  </option>
                ))}
              </Select>
              {errors.locador && (
                <FormErrorMessage>{errors.locador.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.locatario}>
              <FormLabel>Locatario</FormLabel>
              <Select {...register("locatario")}>
                <option value="">Seleccione un locatario</option>
                {personas.map((persona) => (
                  <option key={persona._id} value={persona._id}>
                    {persona.nombreCompleto} ({persona.documento})
                  </option>
                ))}
              </Select>
              {errors.locatario && (
                <FormErrorMessage>{errors.locatario.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.inmueble}>
              <FormLabel>Inmueble</FormLabel>
              <Select {...register("inmueble")}>
                <option value="">Seleccione un inmueble</option>
                {inmuebles.map((inmueble) => (
                  <option key={inmueble._id} value={inmueble._id}>
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
                <FormLabel>Fecha de Inicio</FormLabel>
                <Input type="date" {...register("fechaInicio")} />
                {errors.fechaInicio && (
                  <FormErrorMessage>
                    {errors.fechaInicio.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl flex={1} isInvalid={!!errors.fechaFin}>
                <FormLabel>Fecha de Fin (opcional)</FormLabel>
                <Input type="date" {...register("fechaFin")} />
                {errors.fechaFin && (
                  <FormErrorMessage>{errors.fechaFin.message}</FormErrorMessage>
                )}
              </FormControl>
            </Stack>

            <FormControl isRequired isInvalid={!!errors.monto}>
              <FormLabel>Monto</FormLabel>
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
                    <NumberInputField {...INPUT_STYLES} />
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

export default ContratoForm;
