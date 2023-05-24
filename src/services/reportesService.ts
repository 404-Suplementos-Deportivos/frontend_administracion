import axios from '@/libs/axios'
import { LastSells } from '@/interfaces/Reportes/LastSells'

export const getStockMenorStockMinimo = async (): Promise<any> => {
  const { data } = await axios.get('/reportes/alert-stock-minimo')
  return data
}

export const getLastSells = async (): Promise<any> => {
  const { data } = await axios.get('/reportes/last-sells')
  return data
}

export const getLastRegisterMensual = async ({fechaDesde, fechaHasta}: {fechaDesde: string, fechaHasta: string}): Promise<any> => {
  const { data } = await axios.post('/reportes/last-registers', {fechaDesde, fechaHasta})
  return data
}

export const getLastSellsBuys = async ({fechaDesde, fechaHasta}: {fechaDesde: string, fechaHasta: string}): Promise<any> => {
  const { data } = await axios.post('/reportes/last-sells-buys', {fechaDesde, fechaHasta})
  return data
}

export const getCategorySells = async ({fechaDesde, fechaHasta}: {fechaDesde: string, fechaHasta: string}): Promise<any> => {
  const { data } = await axios.post('/reportes/category-sells', {fechaDesde, fechaHasta})
  return data
}

export const getMostSelledProducts = async ({fechaDesde, fechaHasta}: {fechaDesde: string, fechaHasta: string}): Promise<any> => {
  const { data } = await axios.post('/reportes/most-selled-products', {fechaDesde, fechaHasta})
  return data
}