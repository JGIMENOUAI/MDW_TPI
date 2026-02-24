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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearError, loginUser } from "../features/auth/authSlice";
import { loginSchema, type LoginFormData } from "../schemas/authSchema";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data: LoginFormData) => {
    dispatch(loginUser(data));
  };

  return (
    <Box>
      <Heading mb={6} size="lg" textAlign="center" color="white">
        Iniciar Sesión
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
        p={6}
        borderRadius="md"
        border="1px"
        borderColor="gray.700"
      >
        <VStack spacing={4} align="stretch">
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
              placeholder="••••••••"
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
