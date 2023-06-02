import { useState, useEffect } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CantidadVentasCategoriaChart = ({cantidadVentasCategoria, categoriaSelected}: CantidadVentasCategoriaChartProps) => {
  const [categorias, setCategorias] = useState<CantidadVentasCategoriaChartState['categorias']>([])
  const [categoriaSelectedString, setCategoriaSelectedString] = useState<CantidadVentasCategoriaChartState['categoriaSelectedString']>('')

  useEffect(() => {
    obtenerCategorias();
  }, []);

  useEffect(() => {
    setCategoriaSelectedString(categorias.find( item => item.id === Number(categoriaSelected))?.nombre || '')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriaSelected]);

  const obtenerCategorias = async () => {
    const response = await getCategorias();
    setCategorias(response.data);
  };

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
  
  // generate random background color
  const data = {
    labels: cantidadVentasCategoria.map( item => item.categoria),
    datasets: [
      {
        label: 'Cantidad de ventas',
        data: cantidadVentasCategoria.map( item => item.cantidadVendida),
        backgroundColor: cantidadVentasCategoria.map( item => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`),
      },
    ],
  };


  if (categoriaSelectedString) {
    // mostrar unicamente en el grafico la categoria seleccionada
    data.labels = [categoriaSelectedString]
    data.datasets[0].data = [cantidadVentasCategoria.find( item => item.categoria === categoriaSelectedString)?.cantidadVendida || 0]
  }

  return (
    <Bar options={options} data={data} height={'100%'} width={'100%'}/>
  )
}

export default CantidadVentasCategoriaChart