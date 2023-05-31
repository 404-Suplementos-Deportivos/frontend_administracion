export interface DetalleComprobante {
  id?: number;
  cantidad: number;
  precio: number;
  descuento: number;
  idProducto?: number;
  idComprobante?: number;
  producto?: {
    nombre: string;
    urlImagen: string;
  }
}