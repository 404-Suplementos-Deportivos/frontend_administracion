import { Categoria } from "./Categoria";
import { SubCategoria } from "./SubCategoria";

export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  urlImagen: string;
  idCategoria: number;
  idSubCategoria: number;
  precioLista: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  estado?: boolean;
  categoria?: Categoria;
  subCategoria?: SubCategoria;
}