import React, { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
import { deckAtom } from '~/lib/atoms';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const labels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export const EnergyChart = () => {
  const { theme } = useTheme();
  const [energyData, setEnergyData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const deck = useAtomValue(deckAtom);
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scale: {
      scaleLabel: {
        fontColor: 'red',
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'light' ? 'black' : 'white',
        },
      },
      y: {
        ticks: {
          color: theme === 'light' ? 'black' : 'white',
        },
      },
    },
    plugins: {
      legend: {
        color: 'red',
        display: false,
        position: 'top' as const,
      },
      title: {
        color: theme === 'light' ? 'black' : 'white',
        display: true,
        text: 'Card Energy Costs',
      },
    },
  };

  useEffect(() => {
    setEnergyData((prevEnergyData) => {
      const newData = [...prevEnergyData]; // create a copy of energyData array
      for (let i = 0; i < prevEnergyData.length; i++) {
        const filter = deck.filter((card) => card.gameData.cost === i.toString());
        newData[i] = filter.length;
      }
      return newData;
    });
  }, [deck]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Cards',
        data: [...energyData],
        backgroundColor: '#bef264',
      },
    ],
  };

  return <Bar options={options} data={data} />;
};
