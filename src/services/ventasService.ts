import axios from '@/libs/axios'
import { Comprobante } from '@/interfaces/Comprobante'
import { Cliente } from '@/interfaces/Cliente'

export const getComprobantes = async (): Promise<any> => {
  const { data } = await axios.get('/ventas/all')
  return data
}

export const getClientes = async (): Promise<any> => {
  const { data } = await axios.get<any>('/ventas/clientes')
  return data
}

export const getEstados = async (): Promise<any> => {
  const { data } = await axios.get('/ventas/estados')
  return data
}

export const changeState = async (id: number, idEstado: number): Promise<any> => {
  const { data } = await axios.put(`/ventas/change-state/${id}`, { idEstado })
  return data
}

export const deleteUser = async (id: number): Promise<any> => {
  const { data } = await axios.delete(`/users/${id}`)
  return data
}