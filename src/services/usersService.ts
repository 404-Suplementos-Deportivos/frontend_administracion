import axios from '@/libs/axios'
import { Rol } from '@/interfaces/Rol'
import { User } from '@/interfaces/User'

export const getUsers = async (): Promise<User[]> => {
  const { data } = await axios.get('/users')
  return data
}