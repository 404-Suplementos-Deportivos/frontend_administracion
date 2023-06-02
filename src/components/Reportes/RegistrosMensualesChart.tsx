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
      text: 'Cantidad de cuentas nuevas mensualmente',
    },
  },
};

const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const RegistrosMensualesChart = ({registrosMensuales}: RegistrosMensualesChartProps) => {

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Cuentas nuevas',
        data: registrosMensuales.map(registro => registro.cantidadUsuarios),
        fill: false,
        borderColor: '#111a2c',
        pointBackgroundColor: '#f79310',
        tension: 0.1,
      },
    ],
  };

  return (
    <Line data={data} options={options} height={50} />
  )
}

export default RegistrosMensualesChart