import { DetalleNotaPedido } from "./DetalleNotaPedido";

export interface NotaPedido {
  id: number;
  fecha: string;
  version: number;
  fechaVencimiento: string;
  usuario: string;
  proveedor: string;
  proveedorId?: number;
  estadoNP: string;
  estadoNPId?: number;
  tipoCompra: string
  tipoCompraId?: number;
  detalleNotaPedido: DetalleNotaPedido[];
}