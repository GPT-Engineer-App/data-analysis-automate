import React, { useState } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Input, VStack, Text, Button } from "@chakra-ui/react";
import { FaFileUpload } from "react-icons/fa";

const Index = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const [fileContent, setFileContent] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyzeData = () => {
    if (fileContent) {
      const rows = fileContent.split("\n").filter(Boolean);
      const headers = rows[0].split(",");
      let data = rows.slice(1).map((row) => row.split(","));
      const numericData = data.map((row) => row.map((cell) => parseFloat(cell)).filter((cell) => !isNaN(cell)));
      const statistics = numericData[0].map((_, colIndex) => {
        const mean = numericData.reduce((sum, row) => sum + row[colIndex], 0) / numericData.length;
        return {
          mean: mean,
          median: numericData.map((row) => row[colIndex]).sort()[Math.floor(numericData.length / 2)],
          variance: numericData.reduce((variance, row) => variance + Math.pow(row[colIndex] - mean, 2), 0) / numericData.length,
          numRecords: numericData.length,
        };
      });
      data = data.map((row, index) => [...row, ...Object.values(statistics[index % statistics.length])]);
      setColumns([...headers, "Mean", "Median", "Variance", "Num of Records"]);

      setColumns(headers);
      setData(data);
    }
  };

  return (
    <VStack spacing={4} p={5}>
      <Text fontSize="2xl" fontWeight="bold">
        CSV Data Analysis Tool
      </Text>
      <Input type="file" accept=".csv" onChange={handleFileUpload} />
      <Button colorScheme="blue" onClick={handleAnalyzeData}>
        Analyze Data
      </Button>
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
