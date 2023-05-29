import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Categoria } from '@/interfaces/Categoria';
import { CantidadVentasCategoria } from '@/interfaces/Reportes/CantidadVentasCategoria';
import { getCategorias } from '@/services/reportesService';

interface CantidadVentasCategoriaChartProps {
  cantidadVentasCategoria: CantidadVentasCategoria[]
  categoriaSelected: string,
}

interface CantidadVentasCategoriaChartState {
  categorias: Categoria[]
  categoriaSelectedString: string,
}

ChartJS.register(ArcElement, Tooltip, Legend);

const CantidadVentasCategoriaChart = ({cantidadVentasCategoria, categoriaSelected}: CantidadVentasCategoriaChartProps) => {
  const [categorias, setCategorias] = useState<CantidadVentasCategoriaChartState['categorias']>([])
  const [categoriaSelectedString, setCategoriaSelectedString] = useState<CantidadVentasCategoriaChartState['categoriaSelectedString']>('')

  useEffect(() => {
    obtenerCategorias();
  }, []);

  useEffect(() => {
    setCategoriaSelectedString(categorias.find( item => item.id === Number(categoriaSelected))?.nombre || '')
    console.log( categoriaSelectedString )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriaSelected]);

  const obtenerCategorias = async () => {
    const response = await getCategorias();
    setCategorias(response.data);
  };

  // Tachar opcion seleccionada
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Cantidad de ventas por categoría',
      },
    },
  };
  
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

  if (categoriaSelectedString) {
    // mostrar unicamente en el grafico la categoria seleccionada
    data.labels = [categoriaSelectedString]
    data.datasets[0].data = [cantidadVentasCategoria.find( item => item.categoria === categoriaSelectedString)?.cantidadVendida || 0]
  }

  return (
    <Pie data={data} options={options} height={'100%'} />
  )
}

export default CantidadVentasCategoriaChart