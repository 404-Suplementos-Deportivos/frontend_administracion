import { useState, useEffect } from 'react';
import { notification } from 'antd'
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
import { TipoUsuario } from '@/interfaces/Reportes/TipoUsuario';
import { Categoria } from '@/interfaces/Reportes/Categoria';
import { getLastSells, getLastRegisterMensual, getLastSellsBuys, getCategorySells, getMostSelledProducts, getTiposUsuarios, getCategorias, getStockMenorStockMinimo } from '@/services/reportesService';

type NotificationType = 'success' | 'info' | 'warning' | 'error';
interface HomeState {
  lastSells: LastSells[]
  registrosMensuales: RegistroMensual[]
  compras: Compra[]
  ventas: Venta[]
  cantidadVentasCategoria: CantidadVentasCategoria[]
  mostSelledProducts: MostSelledProducts[]
  tiposUsuario: TipoUsuario[]
  categorias: Categoria[]
  tipoUsuarioSelected: string
  categoriaSelected: string
  fechaDesde: string
  fechaHasta: string
}

export default function Home() {
  const [api, contextHolder] = notification.useNotification();
  const [lastSells, setLastSells] = useState<HomeState['lastSells']>([])
  const [registrosMensuales, setRegistrosMensuales] = useState<HomeState['registrosMensuales']>([])
  const [compras, setCompras] = useState<HomeState['compras']>([])
  const [ventas, setVentas] = useState<HomeState['ventas']>([])
  const [cantidadVentasCategoria, setCantidadVentasCategoria] = useState<HomeState['cantidadVentasCategoria']>([])
  const [mostSelledProducts, setMostSelledProducts] = useState<HomeState['mostSelledProducts']>([])
  const [tiposUsuario, setTiposUsuario] = useState<HomeState['tiposUsuario']>([])
  const [categorias, setCategorias] = useState<HomeState['categorias']>([])
  const [tipoUsuarioSelected, setTipoUsuarioSelected] = useState<HomeState['tipoUsuarioSelected']>('0')
  const [categoriaSelected, setCategoriaSelected] = useState<HomeState['categoriaSelected']>('0')
  const [fechaDesde, setFechaDesde] = useState<HomeState['fechaDesde']>('')
  const [fechaHasta, setFechaHasta] = useState<HomeState['fechaHasta']>('')

  useEffect(() => {
    Promise.all([
      obtenerUltimasVentas(),
      obtenerUltimosRegistrosMensuales(),
      obtenerComprasVentas(),
      obtenerCantidadVentasCategoria(),
      obtenerProductosMasVendidos(),
      obtenerTiposUsuarios(),
      obtenerCategorias(),
      obtenerStockMenorStockMinimo(),
    ])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaDesde, fechaHasta])

  useEffect(() => {
    Promise.all([
      obtenerUltimosRegistrosMensuales(),
      obtenerProductosMasVendidos(),
    ])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoUsuarioSelected, categoriaSelected])

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
      const response = await getLastRegisterMensual({ fechaDesde, fechaHasta, tipoUsuario: Number(tipoUsuarioSelected)});
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
      const response = await getMostSelledProducts({ fechaDesde, fechaHasta, tipoCategoria: Number(categoriaSelected) });
      setMostSelledProducts(response.data)
    } catch (error: any) {
      console.log( error.response.data.message )
    }
  }

  const obtenerTiposUsuarios = async () => {
    try {
      const response = await getTiposUsuarios();
      setTiposUsuario(response.data)
    } catch (error: any) {
      console.log( error.response.data.message )
    }
  }

  const obtenerCategorias = async () => {
    try {
      const response = await getCategorias();
      setCategorias(response.data)
    } catch (error: any) {
      console.log( error.response.data.message )
    }
  }

  const obtenerStockMenorStockMinimo = async () => {
    try {
      const { data } = await getStockMenorStockMinimo()
      if(data.length > 0) {
        openNotificationWithIcon('warning', data)
      }
    } catch (error: any) {
      console.log( error.response.data.message )
    }
  }

  const openNotificationWithIcon = (type: NotificationType, productos: any) => {
    api[type]({
      message: 'Alerta de Productos con Stock Minimo',
      description: (
        <div>
          {productos.map((producto: any) => (
            <div key={producto.id}>
              #{producto.id} {producto.nombre} - Stock: {producto.stock} Min.({producto.stock_minimo})
            </div>
          ))}
        </div>
      ),
      duration: 0,
    });
  };

  return (
    <Layout
      title="Inicio"
    >
      <main style={{
        
      }}>
        {contextHolder}
        <ReportesFilter 
          fechaDesde={fechaDesde}
          setFechaDesde={setFechaDesde}
          fechaHasta={fechaHasta}
          setFechaHasta={setFechaHasta}
          tiposUsuario={tiposUsuario}
          categorias={categorias}
          setTipoUsuarioSelected={setTipoUsuarioSelected}
          setCategoriaSelected={setCategoriaSelected}
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
            gridColumn: '1 / 7',
            gridRow: '3 / 5',
          }}>
            <RegistrosMensualesChart registrosMensuales={registrosMensuales} />
          </div>
          <div style={{
            gridColumn: '1 / 3',
            gridRow: '5 / 7',
          }}>
            <CantidadVentasCategoriaChart cantidadVentasCategoria={cantidadVentasCategoria} />
          </div>
          <div style={{
            gridColumn: '3 / 7',
            gridRow: '5 / 7',
          }}>
            <ListMostSelledProducts mostSelledProducts={mostSelledProducts} />
          </div>
        </div>
      </main>
    </Layout>
  )
}
