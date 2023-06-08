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
import { Venta, Compra } from '@/interfaces/Reportes/ComprasVentasMensuales';

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
  compras: Compra[]
  ventas: Venta[]
}

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Montos mensuales de compras y ventas',
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(context.parsed.y);
          }
          return label;
        },
      },
    },
  },
};

const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const ComprasVentasMensualesChart = ({compras, ventas}: RegistrosMensualesChartProps) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Ventas',
        data: ventas.map(venta => venta.monto),
        fill: false,
        borderColor: '#39b343',
        pointBackgroundColor: '#39b343',
        tension: 0.1,
      },
      {
        label: 'Compras',
        data: compras.map(compra => compra.monto),
        fill: false,
        borderColor: '#e90f0f',
        pointBackgroundColor: '#e90f0f',
        tension: 0.1,
      },
    ],
  };

  return (
    <Line data={data} options={options} style={{width: '100%', height: '100%'}} />
  )
}

export default ComprasVentasMensualesChart