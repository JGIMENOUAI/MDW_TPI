/**
 * Design System Constants
 * Valores centralizados para mantener consistencia visual
 */

// Container y Layout
export const CONTAINER_MAX_WIDTH = "1200px";
export const CONTENT_PADDING = { base: 4, md: 6 };

// Cards y Boxes
export const CARD_STYLES = {
  bg: "gray.800",
  borderRadius: "xl",
  border: "1px",
  borderColor: "gray.700",
  boxShadow: "md",
  p: { base: 5, md: 6 },
} as const;

export const CARD_HOVER = {
  borderColor: "blue.500",
  bg: "gray.750",
} as const;

// Inputs y Forms
export const INPUT_STYLES = {
  bg: "gray.900",
  borderColor: "gray.600",
  color: "white",
  _hover: { borderColor: "gray.500" },
  _focus: {
    borderColor: "blue.500",
    boxShadow: "0 0 0 1px #3182CE",
  },
} as const;

// Buttons - Alturas estándar
export const BUTTON_HEIGHTS = {
  default: "44px", // Para formularios y acciones primarias
  small: "36px", // Para tablas y acciones secundarias
  nav: "40px", // Para navegación
} as const;

// Tablas
export const TABLE_BUTTON_HEIGHT = "36px";
export const TABLE_CELL_PADDING = 4;

// Spacing
export const SECTION_SPACING = 6; // 24px entre secciones
export const ELEMENT_SPACING = 4; // 16px entre elementos
