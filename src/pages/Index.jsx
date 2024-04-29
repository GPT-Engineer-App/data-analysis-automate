import React, { useState } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Input, VStack, Text } from "@chakra-ui/react";
import { FaFileUpload } from "react-icons/fa";

const Index = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        const rows = text.split("\n").filter(Boolean);
        const headers = rows[0].split(",");
        let data = rows.slice(1).map((row) => row.split(","));
        const numericData = data.map((row) => row.map((cell) => parseFloat(cell)).filter((cell) => !isNaN(cell)));
        const statistics = numericData[0].map((_, colIndex) => ({
          mean: numericData.reduce((sum, row) => sum + row[colIndex], 0) / numericData.length,
          median: numericData.map((row) => row[colIndex]).sort()[Math.floor(numericData.length / 2)],
          variance: numericData.reduce((variance, row) => variance + Math.pow(row[colIndex] - this.mean, 2), 0) / numericData.length,
        }));
        data = data.map((row, index) => [...row, ...Object.values(statistics[index % statistics.length])]);

        setColumns(headers);
        setData(data);
      };
      reader.readAsText(file);
    }
  };

  return (
    <VStack spacing={4} p={5}>
      <Text fontSize="2xl" fontWeight="bold">
        CSV Data Analysis Tool
      </Text>
      <Input type="file" accept=".csv" onChange={handleFileUpload} />
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              {columns.map((column, index) => (
                <Th key={index}>{column}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <Td key={cellIndex}>{typeof cell === "number" ? cell.toFixed(2) : cell}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

export default Index;
