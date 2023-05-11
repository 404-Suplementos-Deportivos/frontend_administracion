export interface DetalleNotaPedido {
  cantidadPedida?: number;
  cantidadRecibida?: number;
  precio: number;
  estado?: boolean;
  descuento: number;
  producto?: string;
  productoId: number;
}