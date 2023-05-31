import { useState, useEffect } from "react"
import { Proveedor } from "@/interfaces/Proveedor"
import { TipoIVA } from "@/interfaces/TipoIVA"
import { getTiposIVA } from "@/services/comprasService"

interface ListadoProveedoresFilterProps {
  proveedores: Proveedor[] | undefined
  proveedoresFiltered: Proveedor[] | undefined
  setProveedoresFiltered: (proveedores: Proveedor[]) => void
}

interface ListadoProveedoresFilterState {
  search: string
  estado: boolean
  tipoIVA: string
  tiposIVA: TipoIVA[] | undefined
}

const ListadoProveedoresFilter = ({proveedores, proveedoresFiltered, setProveedoresFiltered}: ListadoProveedoresFilterProps) => {
  const [search, setSearch] = useState<ListadoProveedoresFilterState['search']>('')
  const [estado, setEstado] = useState<ListadoProveedoresFilterState['estado']>(true)
  const [tipoIVA, setTipoIVA] = useState<ListadoProveedoresFilterState['tipoIVA']>('')
  const [tiposIVA, setTiposIVA] = useState<ListadoProveedoresFilterState['tiposIVA']>([])

  useEffect(() => {
    obtenerTiposIVA()
  }, [])

  useEffect(() => {
    if (proveedores) {
      let proveedoresFiltrados = proveedores.filter(proveedor => {
        if (proveedor.email.toLowerCase().includes(search.toLowerCase())) {
          return proveedor
        }
      })
      if (estado) {
        proveedoresFiltrados = proveedoresFiltrados.filter(proveedor => proveedor.estado)
      }
      if (tipoIVA) {
        proveedoresFiltrados = proveedoresFiltrados.filter(proveedor => proveedor.tipoIva?.id === Number(tipoIVA))
      }
      setProveedoresFiltered(proveedoresFiltrados)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proveedores, search, estado, tipoIVA])

  const obtenerTiposIVA = async () => {
    try {
      const response = await getTiposIVA()
      setTiposIVA(response)
    } catch (error: any) {
      console.log(error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    switch (name) {
      case 'search':
        setSearch(value)
        break
      case 'estado':
        setEstado(!estado)
        break
      case 'tipoIVA':
        setTipoIVA(value)
        break
      default:
        break
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
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
          placeholder='E-Mail del Proveedor'
          value={search}
          onChange={handleChange}
        />
      </div>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <span style={{marginRight: '0.5rem'}}>Estado:</span>
        <input
          type="checkbox"
          name='estado'
          checked={estado}
          onChange={handleChange}
        />
        <span style={{marginLeft: '0.2rem'}}>Activo</span>
      </div>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <span style={{marginRight: '0.5rem'}}>Tipo IVA:</span>
        <select
          style={{width: '200px'}}
          name="tipoIVA"
          value={tipoIVA}
          onChange={handleChange}
        >
          <option value="">Todas</option>
          {tiposIVA?.map((tipo: TipoIVA) => (
            <option key={tipo.id} value={tipo.id}>{`${tipo.nombre} - ${tipo.descripcion}`}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default ListadoProveedoresFilter