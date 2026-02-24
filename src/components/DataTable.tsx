import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { type ReactNode } from "react";
import { CARD_STYLES } from "../styles/constants";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  cell?: (value: unknown, row: T) => ReactNode;
  isNumeric?: boolean;
  hideBelow?: "sm" | "md" | "lg" | "xl";
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { _id?: string }>({
  data,
  columns,
  onRowClick,
}: DataTableProps<T>) {
  const getCellValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }
    return row[column.accessor];
  };

  const renderCell = (row: T, column: Column<T>): ReactNode => {
    const value = getCellValue(row, column);
    if (column.cell) {
      return column.cell(value, row);
    }
    return value as ReactNode;
  };

  return (
    <Box
      overflowX="auto"
      {...CARD_STYLES}
      p={0}
      display={{ base: "none", md: "block" }}
    >
      <Table variant="simple">
        <Thead bg="gray.900" position="sticky" top={0} zIndex={1}>
          <Tr>
            {columns.map((column, index) => (
              <Th
                key={index}
                isNumeric={column.isNumeric}
                display={
                  column.hideBelow
                    ? { base: "none", [column.hideBelow]: "table-cell" }
                    : "table-cell"
                }
                borderBottomWidth="2px"
              >
                {column.header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, rowIndex) => (
            <Tr
              key={row._id || rowIndex}
              _hover={{
                bg: "gray.750",
                cursor: onRowClick ? "pointer" : "default",
              }}
              onClick={() => onRowClick?.(row)}
              transition="all 0.15s"
            >
              {columns.map((column, colIndex) => (
                <Td
                  key={colIndex}
                  isNumeric={column.isNumeric}
                  display={
                    column.hideBelow
                      ? { base: "none", [column.hideBelow]: "table-cell" }
                      : "table-cell"
                  }
                >
                  {renderCell(row, column)}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
