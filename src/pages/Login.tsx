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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearError, loginUser } from "../features/auth/authSlice";
import { loginSchema, type LoginFormData } from "../schemas/authSchema";
import { useAppToast } from "../hooks/useToast";
import { PageHeader } from "../components/PageHeader";
import { CARD_STYLES } from "../styles/constants";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showError } = useAppToast();
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: joiResolver(loginSchema),
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
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data: LoginFormData) => {
    dispatch(loginUser(data));
  };

  return (
    <Box w="full">
      <PageHeader
        title="Iniciar Sesión"
        subtitle="Accede a tu cuenta para gestionar contratos e inmuebles"
      />

      <Box as="form" onSubmit={handleSubmit(onSubmit)} {...CARD_STYLES}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="correo@ejemplo.com"              
              {...register("email")}
            />
            {errors.email && (
              <FormErrorMessage>{errors.email.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.password}>
            <FormLabel>Contraseña</FormLabel>
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && (
              <FormErrorMessage>{errors.password.message}</FormErrorMessage>
            )}
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            w="full"
            mt={2}
          >
            Ingresar
          </Button>
        </VStack>
      </Box>

      <Box textAlign="center" mt={4}>
        <Text color="gray.400" fontSize="sm">
          ¿No tienes cuenta?{" "}
          <ChakraLink
            as={Link}
            to="/registro"
            color="blue.400"
            _hover={{ color: "blue.300" }}
          >
            Regístrate
          </ChakraLink>
        </Text>
      </Box>
    </Box>
  );
};

export default Login;
