import axios from '@/libs/axios'
import { Rol } from '@/interfaces/Rol'
import { User } from '@/interfaces/User'

export const getRoles = async (): Promise<Rol[]> => {
  const { data } = await axios.get('/users/roles')
  return data
}

export const getUsers = async (): Promise<User[]> => {
  const { data } = await axios.get('/users')
  return data
}

export const createUser = async (user: User) => {
  const { data } = await axios.post('/users', user)
  return data
}

export const updateUser = async (user: User) => {
  const { data } = await axios.put(`/users/${user.id}`, user)
  return data
}

export const deleteUser = async (id: number) => {
  const { data } = await axios.delete(`/users/${id}`)
  return data
}

export const confirmAccount = async (id: number) => {
  const { data } = await axios.get(`/users/confirm-account/${id}`)
  return data
}