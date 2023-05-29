import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import { UsuarioAuth } from "@/interfaces/UsuarioAuth"
import { getProfile } from "@/services/authService"

type Error = 'success' | 'error' | 'warning' | 'info'

interface AuthState {
  usuario: UsuarioAuth | null
  token: string | undefined
  loading: boolean
  isAuth: boolean
  error: {
    type: Error;
    message: string;
  };
}

const INITIAL_STATE: AuthState = {
  usuario: null,
  token: '',
  loading: false,
  isAuth: false,
  error: {
    type: 'info',
    message: ''
  }
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
      state.isAuth = true
    },
    clearUsuarioAuth: (state) => {
      state.usuario = null
      state.token = ''
      state.isAuth = false
      localStorage.removeItem('token')
    },
    getProfileStart: (state) => {
      state.loading = true
    },
    getProfileSuccess: (state, action: PayloadAction<UsuarioAuth>) => {
      state.usuario = action.payload
      state.loading = false
      state.isAuth = true
    },
    getProfileError: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.isAuth = false
      state.error = {
        type: 'error',
        message: action.payload
      }
    }
  }
});

export const { 
  setToken, 
  setUsuarioAuth, 
  clearUsuarioAuth,
  getProfileStart,
  getProfileSuccess,
  getProfileError
} = authSlice.actions;
export default authSlice.reducer;

export const getToken = (state: any) => state.auth.token

export const getProfileAsync = () => async (dispatch: any) => {
  try {
    dispatch(getProfileStart())
    const response = await getProfile()
    dispatch(getProfileSuccess(response))
  } catch (error: any) {
    dispatch(getProfileError(error.response?.data?.message ?? 'Error al obtener el perfil'))
  }
}