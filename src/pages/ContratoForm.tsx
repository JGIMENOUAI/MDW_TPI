import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
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
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { contratoService } from "../services/contratoService";
import { inmuebleService } from "../services/inmuebleService";
import { personaService } from "../services/personaService";
import type { Contrato, Inmueble, Persona } from "../types";

const ContratoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [formData, setFormData] = useState<Omit<Contrato, "_id">>({
    tipoContrato: "alquiler",
    locador: "",
    locatario: "",
    inmueble: "",
    fechaInicio: "",
    fechaFin: "",
    monto: 0,
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
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.mensaje || "Error al cargar los datos";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const loadContrato = async () => {
    try {
      const data = await contratoService.getById(id!);
      setFormData({
        tipoContrato: data.tipoContrato,
        locador:
          typeof data.locador === "string"
            ? data.locador
            : data.locador?._id || "",
        locatario:
          typeof data.locatario === "string"
            ? data.locatario
            : data.locatario?._id || "",
        inmueble:
          typeof data.inmueble === "string"
            ? data.inmueble
            : data.inmueble?._id || "",
        fechaInicio: data.fechaInicio.split("T")[0],
        fechaFin: data.fechaFin ? data.fechaFin.split("T")[0] : "",
        monto: data.monto,
      });
      setError(null);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.mensaje || "Error al cargar el contrato";
      setError(errorMessage);
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id) {
        await contratoService.update(id, formData);
      } else {
        await contratoService.create(formData);
      }
      navigate("/contratos");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.mensaje || "Error al guardar el contrato";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        onSubmit={handleSubmit}
        bg="gray.800"
        p={{ base: 4, md: 6 }}
        borderRadius="md"
        border="1px"
        borderColor="gray.700"
      >
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel color="gray.300">Tipo de Contrato</FormLabel>
            <Select
              name="tipoContrato"
              value={formData.tipoContrato}
              onChange={handleChange}
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
          </FormControl>

          <FormControl isRequired>
            <FormLabel color="gray.300">Locador</FormLabel>
            <Select
              name="locador"
              value={formData.locador}
              onChange={handleChange}
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
          </FormControl>

          <FormControl isRequired>
            <FormLabel color="gray.300">Locatario</FormLabel>
            <Select
              name="locatario"
              value={formData.locatario}
              onChange={handleChange}
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
          </FormControl>

          <FormControl isRequired>
            <FormLabel color="gray.300">Inmueble</FormLabel>
            <Select
              name="inmueble"
              value={formData.inmueble}
              onChange={handleChange}
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
          </FormControl>

          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <FormControl isRequired flex={1}>
              <FormLabel color="gray.300">Fecha de Inicio</FormLabel>
              <Input
                type="date"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                bg="gray.900"
                borderColor="gray.600"
                color="white"
                _hover={{ borderColor: "gray.500" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #3182CE",
                }}
              />
            </FormControl>

            <FormControl flex={1}>
              <FormLabel color="gray.300">Fecha de Fin</FormLabel>
              <Input
                type="date"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
                bg="gray.900"
                borderColor="gray.600"
                color="white"
                _hover={{ borderColor: "gray.500" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #3182CE",
                }}
              />
            </FormControl>
          </Stack>

          <FormControl isRequired>
            <FormLabel color="gray.300">Monto</FormLabel>
            <NumberInput
              min={0}
              value={formData.monto}
              onChange={(valueString) =>
                setFormData({
                  ...formData,
                  monto: parseFloat(valueString) || 0,
                })
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
