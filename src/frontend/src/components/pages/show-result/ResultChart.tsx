import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { DataTypes } from "../../../types";
import { Card } from '@chakra-ui/react';

ChartJS.register(CategoryScale, LinearScale, BarElement);

const options = {
  responsive: true,
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      display: true,
    },
  },
};

const formatData = (inputData: any) => {
  return {
    labels: Object.keys(inputData).map((item) => item),
    datasets: [
      {
        label: "Результат",
        backgroundColor: "teal",
        data: Object.keys(inputData).map((item) => inputData[item]),
      },
    ],
  };
};

export const ResultChart = ({
  inputData,
}: {
  inputData: any;
}) => {
  const chartData = formatData(inputData);
  return (
    <Card style={{ margin:"10px",padding:'15px'}} alignItems={'center'} maxWidth={'60%'}>
      <Bar options={options} data={chartData} />
    </Card>
  );
};
