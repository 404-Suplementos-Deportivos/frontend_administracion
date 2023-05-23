import { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { RegistroMensual } from '@/interfaces/Reportes/RegistrosMensuales'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RegistrosMensualesChartProps {
  registrosMensuales: RegistroMensual[]
}

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Cantidad de registros por mes',
    },
  },
};

const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const RegistrosMensualesChart = ({registrosMensuales}: RegistrosMensualesChartProps) => {

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Registros',
        data: registrosMensuales.map(registro => registro.cantidadUsuarios),
        fill: false,
        borderColor: '#111a2c',
        tension: 0.1,
      },
    ],
  };

  return (
    <Line data={data} options={options} style={{width: '100%', height: '100%'}} />
  )
}

export default RegistrosMensualesChart