import { useState, useEffect } from 'react';
import Layout from "@/components/Layout/Layout"
import ReportesFilter from '@/components/Reportes/ReportesFilter';
import ListLastSells from '@/components/Reportes/ListLastSells';
import RegistrosMensualesChart from '@/components/Reportes/RegistrosMensualesChart';
import PieChart from '@/components/Reportes/PieChart';
import { LastSells } from '@/interfaces/Reportes/LastSells';
import { RegistroMensual } from '@/interfaces/Reportes/RegistrosMensuales';
import { getLastSells, getLastRegisterMensual } from '@/services/reportesService';

interface HomeState {
  lastSells: LastSells[]
  registrosMensuales: RegistroMensual[]
  fechaDesde: string
  fechaHasta: string
}

export default function Home() {
  const [lastSells, setLastSells] = useState<HomeState['lastSells']>([])
  const [registrosMensuales, setRegistrosMensuales] = useState<HomeState['registrosMensuales']>([])
  const [fechaDesde, setFechaDesde] = useState<HomeState['fechaDesde']>('')
  const [fechaHasta, setFechaHasta] = useState<HomeState['fechaHasta']>('')

  useEffect(() => {
    Promise.all([
      obtenerUltimasVentas(),
      obtenerUltimosRegistrosMensuales()
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
      const response = await getLastRegisterMensual({ fechaDesde, fechaHasta});
      setRegistrosMensuales(response.data)
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
            width: '100%',
          }}>
            <ListLastSells lastSells={lastSells} />
          </div>
          <div style={{
            gridColumn: '3 / 7',
            gridRow: '1 / 3',
            width: '100%',
          }}>
            <RegistrosMensualesChart registrosMensuales={registrosMensuales} />
          </div>
          <div style={{
            gridColumn: '1 / 7',
            gridRow: '3 / 4',
            width: '100%',
          }}>
            <PieChart />
          </div>
        </div>
      </main>
    </Layout>
  )
}
