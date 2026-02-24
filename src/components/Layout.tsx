import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="gray.900">
      <Navbar />
      <Box
        maxW="1200px"
        mx="auto"
        flex="1"
        py={8}
        px={{ base: 4, md: 6 }}
        w="full"
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
