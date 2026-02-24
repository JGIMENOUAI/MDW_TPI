import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// Design tokens - valores consistentes
const tokens = {
  radii: {
    card: "xl", // 12px - para cards y containers
    button: "lg", // 8px - para botones
    input: "md", // 6px - para inputs
  },
  spacing: {
    cardPadding: { base: 5, md: 6 }, // 20px-24px
    sectionGap: 6, // 24px
  },
  sizes: {
    inputHeight: "44px",
    buttonHeight: "44px",
    smallButtonHeight: "36px",
    containerMax: "1200px",
  },
  shadows: {
    card: "md",
    cardHover: "lg",
  },
};

const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: "gray.900",
        color: "white",
      },
    },
  },
  colors: {
    gray: {
      750: "#2D3748", // Color intermedio para hovers
    },
  },
  components: {
    // Estilos globales para Input
    Input: {
      defaultProps: {
        size: "md",
      },
      sizes: {
        md: {
          field: {
            h: tokens.sizes.inputHeight,
            borderRadius: tokens.radii.input,
          },
        },
      },
      variants: {
        outline: {
          field: {
            bg: "gray.900",
            borderColor: "gray.600",
            color: "white",
            _hover: {
              borderColor: "gray.500",
            },
            _focus: {
              borderColor: "blue.500",
              boxShadow: "0 0 0 1px #3182CE",
            },
          },
        },
      },
    },
    // Estilos globales para Select
    Select: {
      defaultProps: {
        size: "md",
      },
      sizes: {
        md: {
          field: {
            h: tokens.sizes.inputHeight,
            borderRadius: tokens.radii.input,
          },
        },
      },
      variants: {
        outline: {
          field: {
            bg: "gray.900",
            borderColor: "gray.600",
            color: "white",
            _hover: {
              borderColor: "gray.500",
            },
          },
        },
      },
    },
    // Estilos globales para Textarea
    Textarea: {
      variants: {
        outline: {
          bg: "gray.900",
          borderColor: "gray.600",
          color: "white",
          borderRadius: tokens.radii.input,
          _hover: {
            borderColor: "gray.500",
          },
          _focus: {
            borderColor: "blue.500",
            boxShadow: "0 0 0 1px #3182CE",
          },
        },
      },
    },
    // Estilos globales para Button
    Button: {
      baseStyle: {
        fontWeight: "medium",
        borderRadius: tokens.radii.button,
      },
      sizes: {
        md: {
          h: tokens.sizes.buttonHeight,
          px: 6,
        },
        sm: {
          h: tokens.sizes.smallButtonHeight,
          px: 4,
        },
      },
    },
    // Estilos globales para Card/Container
    Card: {
      baseStyle: {
        container: {
          bg: "gray.800",
          borderRadius: tokens.radii.card,
          border: "1px solid",
          borderColor: "gray.700",
          boxShadow: tokens.shadows.card,
        },
      },
    },
    // FormLabel consistente
    FormLabel: {
      baseStyle: {
        color: "gray.300",
        fontWeight: "medium",
        fontSize: "sm",
        mb: 1.5,
      },
    },
    // Heading consistente
    Heading: {
      baseStyle: {
        color: "white",
        fontWeight: "bold",
        letterSpacing: "tight",
      },
    },
    // Table consistente
    Table: {
      variants: {
        simple: {
          th: {
            color: "gray.400",
            fontWeight: "semibold",
            fontSize: "sm",
            textTransform: "uppercase",
            letterSpacing: "wider",
            py: 4,
            borderColor: "gray.700",
          },
          td: {
            color: "gray.300",
            py: 4,
            fontSize: "md",
            borderColor: "gray.700",
          },
        },
      },
    },
  },
});

export default theme;
