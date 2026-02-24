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
  Stack,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { inmuebleService } from "../services/inmuebleService";
import type { Inmueble } from "../types";

const InmuebleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Inmueble, "_id">>({
    tipo: "casa",
    descripcion: "",
    ubicacion: "",
  });

  useEffect(() => {
    if (id) {
      loadInmueble();
    }
  }, [id]);

  const loadInmueble = async () => {
    try {
      const data = await inmuebleService.getById(id!);
      setFormData({
        tipo: data.tipo,
        descripcion: data.descripcion,
        ubicacion: data.ubicacion,
        ...(data.hectareas !== undefined && { hectareas: data.hectareas }),
      });
      setError(null);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.mensaje || "Error al cargar el inmueble";
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
        await inmuebleService.update(id, formData);
      } else {
        await inmuebleService.create(formData);
      }
      navigate("/inmuebles");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.mensaje || "Error al guardar el inmueble";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        onSubmit={handleSubmit}
        bg="gray.800"
        p={{ base: 4, md: 6 }}
        borderRadius="md"
        border="1px"
        borderColor="gray.700"
      >
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel color="gray.300">Tipo</FormLabel>
            <Select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
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
          </FormControl>

          <FormControl isRequired>
            <FormLabel color="gray.300">Descripción</FormLabel>
            <Textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
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
          </FormControl>

          <FormControl isRequired>
            <FormLabel color="gray.300">Ubicación</FormLabel>
            <Input
              name="ubicacion"
              value={formData.ubicacion}
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

          <FormControl>
            <FormLabel color="gray.300">Hectáreas (opcional)</FormLabel>
            <NumberInput
              min={0}
              value={formData.hectareas ?? ""}
              onChange={(valueString) =>
                setFormData({
                  ...formData,
                  hectareas: valueString ? parseFloat(valueString) : undefined,
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
