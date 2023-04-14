import { Categoria } from "./Categoria";
import { Subategoria } from "./SubCategoria";

export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  urlImagen: string;
  idCategoria: number;
  idSubCategoria: number;
  precioLista: number;
  stock: number;
  stockMinimo: number;
  estado?: boolean;
  categoria?: Categoria;
  subCategoria?: Subategoria;
}