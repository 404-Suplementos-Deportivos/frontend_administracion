import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import { UsuarioAuth } from "@/interfaces/UsuarioAuth"

interface AuthState {
  usuario: UsuarioAuth | null
  token: string | undefined
}

const INITIAL_STATE: AuthState = {
  usuario: null,
  token: ''
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