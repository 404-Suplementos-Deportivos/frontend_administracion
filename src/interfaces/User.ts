import { Rol } from "./Rol";

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  cuentaConfirmada: boolean;
  direccion: string;
  codigoPostal: number;
  telefono: string;
  fechaNacimiento?: string;
  estado: boolean;
  idRol: number;
  rol?: Rol;
}