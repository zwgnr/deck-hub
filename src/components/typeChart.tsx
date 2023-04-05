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

const labels = ['Unit', 'Relic', 'Effect', 'Upgrade'];

export const TypeChart = () => {
  const { theme } = useTheme();
  const [typeData, setTypeData] = useState([0, 0, 0, 0]);
  const deck = useAtomValue(deckAtom);

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
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
        display: false,
        position: 'top' as const,
      },
      title: {
        color: theme === 'light' ? 'black' : 'white',
        display: true,
        text: 'Card Types',
      },
    },
  };

  useEffect(() => {
    setTypeData((prevTypeData) => {
      const newData = [...prevTypeData];
      for (let i = 0; i < prevTypeData.length; i++) {
        const cardFilters = ['Unit', 'Relic', 'Effect', 'Upgrade'];
        const filter = deck.filter((card) => card.gameData.cardType === cardFilters[i]);
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
        data: [...typeData],
        backgroundColor: '#bef264',
      },
    ],
  };
  return <Bar options={options} data={data} />;
};
