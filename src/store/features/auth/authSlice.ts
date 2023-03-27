import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import { Auth } from "@/interfaces/Auth"

interface AuthState {
  auth: Auth
}

const INITIAL_STATE: AuthState = {
  auth: {} as Auth
}


export const authSlice = createSlice({
  name: 'auth',
  initialState: INITIAL_STATE,
  reducers: {
    
  }
})

export const {  } = authSlice.actions
export default authSlice.reducer