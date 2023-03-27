import { useDispatch, useSelector } from "react-redux"
import { TypedUseSelectorHook } from 'react-redux/es/types'
import { Dispatch, RootState } from "@/store/store"

export const useAppDispatch: () => Dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector