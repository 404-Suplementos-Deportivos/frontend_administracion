import axios from '@/libs/axios'
import { Proveedor } from '@/interfaces/Proveedor'
import { TipoIVA } from '@/interfaces/TipoIVA'
import { NotaPedido } from '@/interfaces/NotaPedido'
import { EstadoNP } from '@/interfaces/EstadoNP'
import { ProductoNP } from '@/interfaces/ProductoNP'

export const getProveedores = async () => {
  const { data } = await axios.get<Proveedor[]>('/compras/proveedores')
  return data
}

export const getProveedor = async (id: number) => {
  const { data } = await axios.get<Proveedor>(`/compras/proveedores/${id}`)
  return data
}

export const getTiposIVA = async () => {
  const { data } = await axios.get<TipoIVA[]>('/compras/tipos-iva')
  return data
}

export const getEstadosNP = async () => {
  const { data } = await axios.get<EstadoNP[]>('/compras/estados-np')
  return data
}

export const createProveedor = async (proveedor: Proveedor) => {
  const { data } = await axios.post('/compras/proveedores', proveedor)
  return data
}

export const updateProveedor = async (proveedor: Proveedor) => {
  console.log( 'updateProveedor', proveedor )
  const { data } = await axios.put(`/compras/proveedores/${proveedor.id}`, proveedor)
  return data
}

export const deleteProveedor = async (id: number) => {
  const { data } = await axios.delete(`/compras/proveedores/${id}`)
  return data
}

export const getNotasPedido = async () => {
  const { data } = await axios.get('/compras')
  return data
}

export const getNotaPedido = async (id: number) => {
  const { data } = await axios.get(`/compras/${id}`)
  return data
}

export const createNotaPedido = async (notaPedido: any) => {
  console.log( 'createNotaPedido', notaPedido )
  const { data } = await axios.post('/compras', notaPedido)
  return data
}

export const updateNotaPedido = async (notaPedido: any) => {
  const { data } = await axios.put(`/compras/${notaPedido.id}`, notaPedido)
  return data
}

export const deleteNotaPedido = async (id: number) => {
  const { data } = await axios.delete(`/compras/${id}`)
  return data
}

export const updateStateNotaPedido = async (id: number, estadoNPId: number) => {
  const { data } = await axios.put(`/compras/notas-pedido/${id}`, { estadoNPId })
  return data
}

export const getProductosProveedor = async (id: number) => {
  const { data } = await axios.get<ProductoNP[]>(`/compras/productos-proveedor/${id}`)
  return data
}