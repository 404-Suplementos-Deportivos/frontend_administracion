import { useState, useEffect } from "react"
import { Cliente } from "@/interfaces/Cliente"

interface ListadoClientesFilterProps {
  clientes: Cliente[] | undefined
  clientesFiltered: Cliente[] | undefined
  setClientesFiltered: (clientes: Cliente[]) => void
}

interface ListadoClientesFilterState {
  search: string
  estado: boolean
}

const ListadoClientesFilter = ({clientes, clientesFiltered, setClientesFiltered}: ListadoClientesFilterProps) => {
  const [search, setSearch] = useState<ListadoClientesFilterState['search']>('')
  const [estado, setEstado] = useState<ListadoClientesFilterState['estado']>(true)

  useEffect(() => {
    if (clientes) {
      let clientesFiltrados = clientes.filter(cliente => {
        if (cliente.email.toLowerCase().includes(search.toLowerCase())) {
          return cliente
        }
      })
      if (estado) {
        clientesFiltrados = clientesFiltrados.filter(cliente => cliente.estado)
      }
      setClientesFiltered(clientesFiltrados)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientes, search, estado])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'search') {
      setSearch(e.target.value)
    } else if (e.target.name === 'estado') {
      setEstado(e.target.checked)
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
          placeholder='E-Mail del Cliente'
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
    </div>
  )
}

export default ListadoClientesFilter