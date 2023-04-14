import axios from '@/libs/axios'
import { UsuarioAuth } from '@/interfaces/UsuarioAuth'
import { UsuarioLogin } from '@/interfaces/UsuarioLogin';

interface LoginResponse {
  token: string;
}

export const login = async (usuario: UsuarioLogin): Promise<LoginResponse> => {
  const { data } =  await axios.post<LoginResponse>('/auth/login', usuario)
  return data
}

export const getProfile = async (): Promise<UsuarioAuth> => {
  const { data } = await axios.get<UsuarioAuth>('/auth/profile')
  return data
}