import axios from '@/libs/axios'
import { Producto } from '@/interfaces/Producto'
import { Categoria } from '@/interfaces/Categoria'
import { Subategoria } from '@/interfaces/SubCategoria'

export const getCategories = async (): Promise<Categoria[]> => {
  const { data } = await axios.get('/products/categories')
  return data
}

export const getSubCategories = async (id: number): Promise<Subategoria[]> => {
  const { data } = await axios.get(`/products/subcategories/${id}`)
  return data
}

export const getProducts = async (): Promise<Producto[]> => {
  const { data } = await axios.get('/products')
  return data
}

export const getProduct = async (id: number): Promise<Producto> => {
  const { data } = await axios.get(`/products/${id}`)
  return data
}

export const createProduct = async (product: Producto) => {
  const { data } = await axios.post('/products', product)
  return data
}