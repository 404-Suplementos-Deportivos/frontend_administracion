import { useState } from "react"
import { LastSells } from "@/interfaces/Reportes/LastSells"

interface ListLastSellsProps {
  lastSells: LastSells[]
}

const ListLastSells = ({lastSells}: ListLastSellsProps) => {
  return (
    <div>
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#111a2c',
        color: 'white',
      }}>
        <h3>Últimas ventas realizadas</h3>
        <p>en los últimos 30 días</p>
      </div>
      <div>
        {lastSells.map((lastSell) => (
          <div key={lastSell.numero_factura} style={{
            width: '100%',
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
              width: '100%',
            }}>
              <p style={{margin: '0'}}>#{lastSell.numero_factura}</p>
              <p style={{margin: '0'}}>{lastSell.fecha}</p>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '10px 20px',
              width: '100%',
            }}>
              <p style={{margin: '0'}}>{lastSell.usuario}</p>
              <p style={{margin: '0'}}>${lastSell.total.toFixed(2)}</p>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '8px',
              padding: '10px 20px',
              width: '100%',
            }}>
              <p style={{margin: '0'}}>{lastSell.estado}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListLastSells