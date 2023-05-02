import axios from '@/libs/axios'
import { Producto } from '@/interfaces/Producto'
import { Categoria } from '@/interfaces/Categoria'
import { SubCategoria } from '@/interfaces/SubCategoria'

export const getCategories = async (): Promise<Categoria[]> => {
  const { data } = await axios.get('/products/categories')
  return data
}

export const createCategory = async (category: Categoria) => {
  const { data } = await axios.post('/products/categories', category)
  return data
}

export const updateCategory = async (category: Categoria) => {
  const { data } = await axios.put(`/products/categories/${category.id}`, {nombre: category.nombre, descripcion: category.descripcion})
  return data
}

export const deleteCategory = async (id: number) => {
  const { data } = await axios.delete(`/products/categories/${id}`)
  return data
}

export const getSubCategories = async (id: number): Promise<SubCategoria[]> => {
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

export const getGanancias = async (): Promise<any> => {
  const { data } = await axios.get('/products/profits')
  return data
}

export const createGanancia = async (ganancia: any) => {
  const { data } = await axios.post('/products/profits', ganancia)
  return data
}