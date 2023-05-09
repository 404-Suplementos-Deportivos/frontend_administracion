import { DetalleNotaPedido } from "./DetalleNotaPedido";

export interface NotaPedido {
  id: number;
  fecha: string;
  version: number;
  fechaVencimiento: string;
  usuario: string;
  proveedor: string;
  estadoNP: string;
  tipoCompra: string
  detalleNotaPedido?: DetalleNotaPedido[];
}