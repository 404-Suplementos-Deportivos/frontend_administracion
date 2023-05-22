import axios from '@/libs/axios'

export const getStockMenorStockMinimo = async (): Promise<any> => {
  const res = await axios.get('/reportes/alert-stock-minimo')
  return res.data
}