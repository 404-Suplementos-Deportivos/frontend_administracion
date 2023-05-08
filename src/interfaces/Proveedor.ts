import { TipoIVA } from "./TipoIVA";

export interface Proveedor {
  id?: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  codigoPostal: number;
  estado?: boolean;
  tipoIva?: TipoIVA;
  tipoIvaId?: number;
}