import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { CantidadVentasCategoria } from '@/interfaces/Reportes/CantidadVentasCategoria';

interface CantidadVentasCategoriaChartProps {
  cantidadVentasCategoria: CantidadVentasCategoria[]
}

ChartJS.register(ArcElement, Tooltip, Legend);

const CantidadVentasCategoriaChart = ({cantidadVentasCategoria}: CantidadVentasCategoriaChartProps) => {

  const data = {
    labels: cantidadVentasCategoria.map( item => item.categoria ),
    datasets: [
      {
        label: 'Cantidad de Ventas',
        data: cantidadVentasCategoria.map( item => item.cantidadVendida ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(128, 0, 0, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(128, 0, 0, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Pie data={data} height={'100%'} />
  )
}

export default CantidadVentasCategoriaChart