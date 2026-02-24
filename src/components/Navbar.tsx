import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logoutUser } from "../features/auth/authSlice";

const Navbar = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
    navigate("/");
  };

  const handleNavClick = () => {
    onClose();
  };

  return (
    <>
      <Box bg="gray.800" px={4} borderBottom="1px" borderColor="gray.700">
        <Flex
          h={16}
          alignItems="center"
          justifyContent="space-between"
          maxW="1200px"
          mx="auto"
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <Text fontSize="xl" fontWeight="bold" color="white">
              Contratos
            </Text>
          </Link>

          {/* Desktop Navigation */}
          <HStack
            spacing={6}
            fontSize="md"
            display={{ base: "none", md: "flex" }}
          >
            {isAuthenticated ? (
              <>
                <Link to="/personas" style={{ textDecoration: "none" }}>
                  <Text
                    color="gray.300"
                    _hover={{ color: "white" }}
                    transition="color 0.2s"
                  >
                    Personas
                  </Text>
                </Link>
                <Link to="/inmuebles" style={{ textDecoration: "none" }}>
                  <Text
                    color="gray.300"
                    _hover={{ color: "white" }}
                    transition="color 0.2s"
                  >
                    Inmuebles
                  </Text>
                </Link>
                <Link to="/contratos" style={{ textDecoration: "none" }}>
                  <Text
                    color="gray.300"
                    _hover={{ color: "white" }}
                    transition="color 0.2s"
                  >
                    Contratos
                  </Text>
                </Link>
                <Text color="gray.400" fontSize="sm">
                  {user?.email}
                </Text>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={handleLogout}
                  variant="outline"
                  minH="44px"
                >
                  Salir
                </Button>
              </>
            ) : (
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button size="sm" colorScheme="blue" minH="44px">
                  Ingresar
                </Button>
              </Link>
            )}
          </HStack>

          {/* Mobile Hamburger */}
          <IconButton
            aria-label="Abrir menú"
            icon={<HamburgerIcon />}
            onClick={onOpen}
            display={{ base: "flex", md: "none" }}
            variant="ghost"
            color="white"
            minH="44px"
            minW="44px"
            _hover={{ bg: "gray.700" }}
          />
        </Flex>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.800">
          <DrawerCloseButton color="white" minH="44px" minW="44px" />
          <DrawerHeader
            color="white"
            borderBottomWidth="1px"
            borderColor="gray.700"
          >
            Menú
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="stretch" mt={4}>
              {isAuthenticated ? (
                <>
                  <Text color="gray.400" fontSize="sm" mb={2}>
                    {user?.email}
                  </Text>
                  <Link
                    to="/personas"
                    style={{ textDecoration: "none" }}
                    onClick={handleNavClick}
                  >
                    <Button
                      w="full"
                      variant="ghost"
                      color="white"
                      justifyContent="flex-start"
                      minH="44px"
                      _hover={{ bg: "gray.700" }}
                    >
                      Personas
                    </Button>
                  </Link>
                  <Link
                    to="/inmuebles"
                    style={{ textDecoration: "none" }}
                    onClick={handleNavClick}
                  >
                    <Button
                      w="full"
                      variant="ghost"
                      color="white"
                      justifyContent="flex-start"
                      minH="44px"
                      _hover={{ bg: "gray.700" }}
                    >
                      Inmuebles
                    </Button>
                  </Link>
                  <Link
                    to="/contratos"
                    style={{ textDecoration: "none" }}
                    onClick={handleNavClick}
                  >
                    <Button
                      w="full"
                      variant="ghost"
                      color="white"
                      justifyContent="flex-start"
                      minH="44px"
                      _hover={{ bg: "gray.700" }}
                    >
                      Contratos
                    </Button>
                  </Link>
                  <Button
                    w="full"
                    colorScheme="red"
                    onClick={handleLogout}
                    variant="outline"
                    minH="44px"
                    mt={4}
                  >
                    Salir
                  </Button>
                </>
              ) : (
                <Link
                  to="/login"
                  style={{ textDecoration: "none" }}
                  onClick={handleNavClick}
                >
                  <Button w="full" colorScheme="blue" minH="44px">
                    Ingresar
                  </Button>
                </Link>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
