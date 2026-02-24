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
  Link as ChakraLink,
  Text,
  VStack,
} from "@chakra-ui/react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearError, registerUser } from "../features/auth/authSlice";
import { registerSchema, type RegisterFormData } from "../schemas/authSchema";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: joiResolver(registerSchema),
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && success) {
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }
  }, [isAuthenticated, success, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    const result = await dispatch(
      registerUser({
        nombre: data.nombre,
        email: data.email,
        password: data.password,
      }),
    );

    if (registerUser.fulfilled.match(result)) {
      setSuccess(true);
    }
  };

  return (
    <Box>
      <Heading mb={6} size="lg" textAlign="center" color="white">
        Crear Cuenta
      </Heading>

      {(error || Object.keys(errors).length > 0) && (
        <Alert
          status="error"
          mb={4}
          bg="red.900"
          color="white"
          borderRadius="md"
        >
          <AlertIcon />
          {error ||
            Object.values(errors)[0]?.message ||
            "Por favor corrija los errores"}
        </Alert>
      )}

      {success && (
        <Alert
          status="success"
          mb={4}
          bg="green.900"
          color="white"
          borderRadius="md"
        >
          <AlertIcon />
          Cuenta creada exitosamente. Redirigiendo al login...
        </Alert>
      )}

      <Box
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        bg="gray.800"
        p={6}
        borderRadius="md"
        border="1px"
        borderColor="gray.700"
      >
        <VStack spacing={4} align="stretch">
          <FormControl isRequired isInvalid={!!errors.nombre}>
            <FormLabel color="gray.300">Nombre</FormLabel>
            <Input
              {...register("nombre")}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182CE",
              }}
              placeholder="Tu nombre completo"
            />
            {errors.nombre && (
              <FormErrorMessage>{errors.nombre.message}</FormErrorMessage>
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
              placeholder="correo@ejemplo.com"
            />
            {errors.email && (
              <FormErrorMessage>{errors.email.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.password}>
            <FormLabel color="gray.300">Contraseña</FormLabel>
            <Input
              type="password"
              {...register("password")}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182CE",
              }}
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && (
              <FormErrorMessage>{errors.password.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.confirmPassword}>
            <FormLabel color="gray.300">Confirmar Contraseña</FormLabel>
            <Input
              type="password"
              {...register("confirmPassword")}
              bg="gray.900"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182CE",
              }}
              placeholder="Repite tu contraseña"
            />
            {errors.confirmPassword && (
              <FormErrorMessage>
                {errors.confirmPassword.message}
              </FormErrorMessage>
            )}
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            w="full"
            mt={2}
          >
            Registrarse
          </Button>
        </VStack>
      </Box>

      <Box textAlign="center" mt={4}>
        <Text color="gray.400" fontSize="sm">
          ¿Ya tienes cuenta?{" "}
          <ChakraLink
            as={Link}
            to="/login"
            color="blue.400"
            _hover={{ color: "blue.300" }}
          >
            Inicia sesión
          </ChakraLink>
        </Text>
      </Box>
    </Box>
  );
};

export default Register;
