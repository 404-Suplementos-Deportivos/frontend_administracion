import { useState, useEffect } from "react"
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import { NotaPedido } from "@/interfaces/NotaPedido";
import { EstadoNP } from "@/interfaces/EstadoNP";
import { getEstadosNP } from "@/services/comprasService";

interface ListadoComprasFilterProps {
  compras: NotaPedido[] | undefined
  comprasFiltered: NotaPedido[] | undefined
  setComprasFiltered: (compras: NotaPedido[]) => void
}

interface ListadoComprasFilterState {
  search: string // Proveedor
  fechaDesde: string
  fechaHasta: string
  fechaVencimientoDesde: string
  fechaVencimientoHasta: string
  estado: string
  estadosNP: EstadoNP[]
  tipoCompra: string
}

interface SelectOption {
  value: string;
  label: string;
}

const { RangePicker } = DatePicker;


const ListadoComprasFilter = ({compras, comprasFiltered, setComprasFiltered}: ListadoComprasFilterProps) => {
  const [search, setSearch] = useState<ListadoComprasFilterState['search']>('')
  const [fechaDesde, setFechaDesde] = useState<ListadoComprasFilterState['fechaDesde']>('')
  const [fechaHasta, setFechaHasta] = useState<ListadoComprasFilterState['fechaHasta']>('')
  const [fechaVencimientoDesde, setFechaVencimientoDesde] = useState<ListadoComprasFilterState['fechaVencimientoDesde']>('')
  const [fechaVencimientoHasta, setFechaVencimientoHasta] = useState<ListadoComprasFilterState['fechaVencimientoHasta']>('')
  const [estado, setEstado] = useState<ListadoComprasFilterState['estado']>('')
  const [estadosNP, setEstadosNP] = useState<ListadoComprasFilterState['estadosNP']>([])
  const [tipoCompra, setTipoCompra] = useState<ListadoComprasFilterState['tipoCompra']>('')

  const tiposCompra: SelectOption[] = [
    { value: "1", label: 'Local' },
    { value: "2", label: 'Exterior' },
  ]

  useEffect(() => {
    obtenerEstadosNP()
  }, [])

  useEffect(() => {
    if (compras) {
      let comprasFiltradas = compras.filter(compra => {
        if (compra.proveedor.toLowerCase().includes(search.toLowerCase())) {
          return compra
        }
      })
      if (fechaDesde && fechaHasta) {
        comprasFiltradas = comprasFiltradas.filter(compra => {
          if (dayjs(compra.fecha).diff(dayjs(fechaDesde)) >= 0 && dayjs(compra.fecha).diff(dayjs(fechaHasta)) <= 0) {
            return compra
          }
        })
      }
      if (fechaVencimientoDesde && fechaVencimientoHasta) {
        comprasFiltradas = comprasFiltradas.filter(compra => {
          if (dayjs(compra.fechaVencimiento).diff(dayjs(fechaVencimientoDesde)) >= 0 && dayjs(compra.fechaVencimiento).diff(dayjs(fechaVencimientoHasta)) <= 0) {
            return compra
          }
        })
      }
      if (estado) {
        comprasFiltradas = comprasFiltradas.filter(compra => {
          if (compra.estadoNPId === parseInt(estado)) {
            return compra
          }
        })
      }
      if (tipoCompra) {
        comprasFiltradas = comprasFiltradas.filter(compra => {
          if (compra.tipoCompraId === parseInt(tipoCompra)) {
            return compra
          }
        })
      }
      setComprasFiltered(comprasFiltradas)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compras, search, fechaDesde, fechaHasta, fechaVencimientoDesde, fechaVencimientoHasta, estado, tipoCompra])
  
  const obtenerEstadosNP = async () => {
    try {
      const response = await getEstadosNP()
      setEstadosNP(response)
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
      case 'tipoCompra':
        setTipoCompra(value)
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
          placeholder='Nombre del proveedor'
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
          <span style={{marginRight: '0.5rem'}}>Estado de compra:</span>
          <select
            style={{width: '200px'}}
            name="estado"
            value={estado}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            {estadosNP.map((estadoNP) => (
              <option key={estadoNP.id} value={estadoNP.id}>{estadoNP.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <span style={{marginRight: '0.5rem'}}>Tipo de compra:</span>
          <select
            style={{width: '200px'}}
            name="tipoCompra"
            value={tipoCompra}
            onChange={handleChange}
          >
            <option value="">Todas</option>
            {tiposCompra.map((tipoCompra) => (
              <option key={tipoCompra.value} value={tipoCompra.value}>{tipoCompra.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default ListadoComprasFilter