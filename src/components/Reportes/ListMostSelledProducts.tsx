import { useState } from "react"
import { MostSelledProducts } from "@/interfaces/Reportes/MostSelledProducts"

interface ListMostSelledProductsProps {
  mostSelledProducts: MostSelledProducts[]
}

const ListMostSelledProducts = ({mostSelledProducts}: ListMostSelledProductsProps) => {
  return (
    <div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#111a2c',
        color: 'white',
      }}>
        <h3>Productos más vendidos</h3>
        <p>por cada categoría</p>
      </div>
      <div>
        {mostSelledProducts.map((product, index) => (
          <div key={index} style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid #111a2c',
            fontWeight: 'bold',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '10px 20px',
              flexBasis: '75%',  // El primer div ocupa 3/4 del espacio disponible
              flexGrow: 1,    
            }}>
              <p style={{margin: '0'}}>Categoria: <span style={{fontWeight: 'normal'}}>{product.categoria}</span></p>
              <p style={{margin: '0'}}>Producto: <span style={{fontWeight: 'normal'}}>{product.productoMasVendido ? product.productoMasVendido : '-'}</span></p>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '10px 20px',
              flexBasis: '25%',
            }}>
              <p style={{margin: '0'}}>Cantidad vendida: <span style={{fontWeight: 'normal'}}>{product.cantidadVendida ? product.cantidadVendida : '-'}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListMostSelledProducts