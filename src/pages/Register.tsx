import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import { useAppToast } from "../hooks/useToast";
import { PageHeader } from "../components/PageHeader";
import { CARD_STYLES } from "../styles/constants";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useAppToast();
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
    if (error) {
      showError(error);
      dispatch(clearError());
    }
  }, [error, showError, dispatch]);

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
      showSuccess("Cuenta creada exitosamente. Redirigiendo...");
    }
  };

  return (
    <Box w="full">
      <PageHeader
        title="Crear Cuenta"
        subtitle="Regístrate para acceder al sistema de gestión de contratos"
      />

      <Box as="form" onSubmit={handleSubmit(onSubmit)} {...CARD_STYLES}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired isInvalid={!!errors.nombre}>
            <FormLabel>Nombre</FormLabel>
            <Input {...register("nombre")} placeholder="Tu nombre completo" />
            {errors.nombre && (
              <FormErrorMessage>{errors.nombre.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              {...register("email")}
              placeholder="correo@ejemplo.com"
            />
            {errors.email && (
              <FormErrorMessage>{errors.email.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.password}>
            <FormLabel>Contraseña</FormLabel>
            <Input
              type="password"
              {...register("password")}
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && (
              <FormErrorMessage>{errors.password.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.confirmPassword}>
            <FormLabel>Confirmar Contraseña</FormLabel>
            <Input
              type="password"
              {...register("confirmPassword")}
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
