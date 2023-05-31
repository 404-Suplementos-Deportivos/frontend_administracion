import { useState, useEffect } from "react"
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import { Comprobante } from "@/interfaces/Comprobante";
import { EstadoComprobante } from "@/interfaces/EstadoComprobante";
import { getEstados } from "@/services/ventasService";

interface ListadoVentasFilterProps {
  ventas: Comprobante[] | undefined
  ventasFiltered: Comprobante[] | undefined
  setVentasFiltered: (ventas: Comprobante[]) => void
}

interface ListadoVentasFilterState {
  search: string // Cliente
  fechaDesde: string
  fechaHasta: string
  fechaVencimientoDesde: string
  fechaVencimientoHasta: string
  estado: string
  estadosComprobante: EstadoComprobante[]
}

const { RangePicker } = DatePicker;

const ListadoVentasFilter = ({ventas, ventasFiltered, setVentasFiltered}: ListadoVentasFilterProps) => {
  const [search, setSearch] = useState<ListadoVentasFilterState['search']>('')
  const [fechaDesde, setFechaDesde] = useState<ListadoVentasFilterState['fechaDesde']>('')
  const [fechaHasta, setFechaHasta] = useState<ListadoVentasFilterState['fechaHasta']>('')
  const [fechaVencimientoDesde, setFechaVencimientoDesde] = useState<ListadoVentasFilterState['fechaVencimientoDesde']>('')
  const [fechaVencimientoHasta, setFechaVencimientoHasta] = useState<ListadoVentasFilterState['fechaVencimientoHasta']>('')
  const [estado, setEstado] = useState<ListadoVentasFilterState['estado']>('')
  const [estadosComprobante, setEstadosComprobante] = useState<ListadoVentasFilterState['estadosComprobante']>([])

  useEffect(() => {
    obtenerEstadosComprobante()
  }, [])

  useEffect(() => {
    if (ventas) {
      let ventasFiltradas = ventas.filter(venta => {
        if (venta.usuario?.email.toLowerCase().includes(search.toLowerCase())) {
          return venta
        }
      })
      if (fechaDesde && fechaHasta) {
        ventasFiltradas = ventasFiltradas.filter(venta => {
          if (dayjs(venta.fecha).diff(dayjs(fechaDesde)) >= 0 && dayjs(venta.fecha).diff(dayjs(fechaHasta)) <= 0) {
            return venta
          }
        })
      }
      if (fechaVencimientoDesde && fechaVencimientoHasta) {
        ventasFiltradas = ventasFiltradas.filter(venta => {
          if (dayjs(venta.fechaVencimiento).diff(dayjs(fechaVencimientoDesde)) >= 0 && dayjs(venta.fechaVencimiento).diff(dayjs(fechaVencimientoHasta)) <= 0) {
            return venta
          }
        })
      }
      if (estado) {
        ventasFiltradas = ventasFiltradas.filter(venta => {
          if (venta.idEstado === parseInt(estado)) {
            return venta
          }
        })
      }
      setVentasFiltered(ventasFiltradas)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ventas, search, fechaDesde, fechaHasta, fechaVencimientoDesde, fechaVencimientoHasta, estado])


  const obtenerEstadosComprobante = async () => {
    try {
      const { data } = await getEstados()
      setEstadosComprobante(data)
    } catch (error: any) {
      console.log(error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    switch (name) {
      case 'search':
        setSearch(value)
        break;
      case 'estado':
        setEstado(value)
        break;
      default:
        break;
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem',
      backgroundColor: 'white',
      padding: '10px 20px',
      borderRadius: '10px'
    }} >
      <div style={{display: 'flex', alignItems: 'center'}}>
        <span style={{marginRight: '0.5rem'}}>Buscar:</span>
        <input
          style={{width: '200px'}}
          type="text"
          name="search"
          placeholder='E-Mail del cliente'
          value={search}
          onChange={handleChange}
        />
      </div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px'}}>
        <div>
          <span style={{marginRight: '0.5rem'}}>Fecha:</span>
          <RangePicker 
            onChange={(dates, dateStrings) => {
              setFechaDesde(dateStrings[0])
              setFechaHasta(dateStrings[1])
            }}
          />
        </div>
        <div>
          <span style={{marginRight: '0.5rem'}}>Vencimiento:</span>
          <RangePicker 
            onChange={(dates, dateStrings) => {
              setFechaVencimientoDesde(dateStrings[0])
              setFechaVencimientoHasta(dateStrings[1])
            }}
          />
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px'}}>
        <div>
          <span style={{marginRight: '0.5rem'}}>Estado de venta:</span>
          <select
            style={{width: '200px'}}
            name="estado"
            value={estado}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            {estadosComprobante.map(estado => (
              <option key={estado.id} value={estado.id}>{estado.nombre}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default ListadoVentasFilter