import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import { UsuarioAuth } from "@/interfaces/UsuarioAuth"

interface AuthState {
  usuario: UsuarioAuth | null
  token: string | undefined
}

const INITIAL_STATE: AuthState = {
  usuario: null,
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTAsImVtYWlsIjoiZmFicnllZG1AZ21haWwuY29tIiwibm9tYnJlIjoiRmFicml6emlvIiwicm9sIjoiQWRtaW5pc3RyYWRvciIsImlhdCI6MTY4Mjk0NTYxNiwiZXhwIjoxNjg1NTM3NjE2fQ.ZosZNQHFhvkoA4gLFM6398mpq8-0w_oayysJ7oDz8JU'
}

export const authSlice = createSlice({
  name: "auth",
  initialState: INITIAL_STATE,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      localStorage.setItem('token', action.payload)
    },
    setUsuarioAuth: (state, action: PayloadAction<UsuarioAuth>) => {
      state.usuario = action.payload
    },
    clearUsuarioAuth: (state) => {
      state.usuario = null
      state.token = ''
      localStorage.removeItem('token')
    }
  }
});

export const { setToken, setUsuarioAuth, clearUsuarioAuth } = authSlice.actions;
export default authSlice.reducer;

export const getToken = (state: any) => state.auth.token