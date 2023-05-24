import { useState, useEffect } from 'react';
import Layout from "@/components/Layout/Layout"
import ReportesFilter from '@/components/Reportes/ReportesFilter';
import ListLastSells from '@/components/Reportes/ListLastSells';
import RegistrosMensualesChart from '@/components/Reportes/RegistrosMensualesChart';
import ComprasVentasMensualesChart from '@/components/Reportes/ComprasVentasMensualesChart';
import CantidadVentasCategoriaChart from '@/components/Reportes/CantidadVentasCategoriaChart';
import ListMostSelledProducts from '@/components/Reportes/ListMostSelledProducts';
import { LastSells } from '@/interfaces/Reportes/LastSells';
import { RegistroMensual } from '@/interfaces/Reportes/RegistrosMensuales';
import { Compra, Venta } from '@/interfaces/Reportes/ComprasVentasMensuales';
import { CantidadVentasCategoria } from '@/interfaces/Reportes/CantidadVentasCategoria';
import { MostSelledProducts } from '@/interfaces/Reportes/MostSelledProducts';
import { getLastSells, getLastRegisterMensual, getLastSellsBuys, getCategorySells, getMostSelledProducts } from '@/services/reportesService';

interface HomeState {
  lastSells: LastSells[]
  registrosMensuales: RegistroMensual[]
  compras: Compra[]
  ventas: Venta[]
  cantidadVentasCategoria: CantidadVentasCategoria[]
  mostSelledProducts: MostSelledProducts[]
  fechaDesde: string
  fechaHasta: string
}

export default function Home() {
  const [lastSells, setLastSells] = useState<HomeState['lastSells']>([])
  const [registrosMensuales, setRegistrosMensuales] = useState<HomeState['registrosMensuales']>([])
  const [compras, setCompras] = useState<HomeState['compras']>([])
  const [ventas, setVentas] = useState<HomeState['ventas']>([])
  const [cantidadVentasCategoria, setCantidadVentasCategoria] = useState<HomeState['cantidadVentasCategoria']>([])
  const [mostSelledProducts, setMostSelledProducts] = useState<HomeState['mostSelledProducts']>([])
  const [fechaDesde, setFechaDesde] = useState<HomeState['fechaDesde']>('')
  const [fechaHasta, setFechaHasta] = useState<HomeState['fechaHasta']>('')

  useEffect(() => {
    Promise.all([
      obtenerUltimasVentas(),
      obtenerUltimosRegistrosMensuales(),
      obtenerComprasVentas(),
      obtenerCantidadVentasCategoria(),
      obtenerProductosMasVendidos()
    ])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaDesde, fechaHasta])

  const obtenerUltimasVentas = async () => {
    try {
      const response = await getLastSells();
      setLastSells(response.data)
    } catch (error: any) {
      console.log( error.response.data.message )
    }
  }

  const obtenerUltimosRegistrosMensuales = async () => {
    try {
      const response = await getLastRegisterMensual({ fechaDesde, fechaHasta });
      setRegistrosMensuales(response.data)
    } catch (error: any) {
      console.log( error.response.data.message )
    }
  }

  const obtenerComprasVentas = async () => {
    try {
      const response = await getLastSellsBuys({ fechaDesde, fechaHasta });
      setCompras(response.compras)
      setVentas(response.ventas)
    } catch (error: any) {
      console.log( error.response.data.message )
    }
  }

  const obtenerCantidadVentasCategoria = async () => {
    try {
      const response = await getCategorySells({ fechaDesde, fechaHasta });
      setCantidadVentasCategoria(response.data)
    } catch (error: any) {
      console.log( error.response.data.message )
    }
  }

  const obtenerProductosMasVendidos = async () => {
    try {
      const response = await getMostSelledProducts({ fechaDesde, fechaHasta });
      setMostSelledProducts(response.data)
    } catch (error: any) {
      console.log( error.response.data.message )
    }
  }

  return (
    <Layout
      title="Inicio"
    >
      <main style={{
        
      }}>
        <ReportesFilter 
          fechaDesde={fechaDesde}
          setFechaDesde={setFechaDesde}
          fechaHasta={fechaHasta}
          setFechaHasta={setFechaHasta}
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '3rem'
        }}>
          <div style={{
            gridColumn: '1 / 3',
            gridRow: '1 / 3',
          }}>
            <ListLastSells lastSells={lastSells} />
          </div>
          <div style={{
            gridColumn: '3 / 7',
            gridRow: '1 / 3',
          }}>
            <ComprasVentasMensualesChart compras={compras} ventas={ventas} />
          </div>
          <div style={{
            gridColumn: '1 / 3',
            gridRow: '3 / 5',
          }}>
            <RegistrosMensualesChart registrosMensuales={registrosMensuales} />
          </div>
          <div style={{
            gridColumn: '3 / 5',
            gridRow: '3 / 5',
          }}>
            <CantidadVentasCategoriaChart cantidadVentasCategoria={cantidadVentasCategoria} />
          </div>
          <div style={{
            gridColumn: '5 / 7',
            gridRow: '3 / 5',
          }}>
            <ListMostSelledProducts mostSelledProducts={mostSelledProducts} />
          </div>
        </div>
      </main>
    </Layout>
  )
}
