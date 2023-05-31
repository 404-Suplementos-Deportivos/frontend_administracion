import {useState, useEffect} from 'react'
import { User } from '@/interfaces/User'
import { Rol } from '@/interfaces/Rol'
import { getRoles } from '@/services/usersService'

interface ListadoUsuariosFilterProps {
  usuarios: User[] | undefined
  usuariosFiltered: User[] | undefined
  setUsuariosFiltered: (usuarios: User[]) => void
}

interface ListadoUsuariosFilterState {
  search: string
  estado: boolean
  cuentaConfirmada: boolean
  rol: string
  roles: Rol[] | undefined
}

const ListadoUsuariosFilter = ({usuarios, usuariosFiltered, setUsuariosFiltered}: ListadoUsuariosFilterProps) => {
  const [search, setSearch] = useState<ListadoUsuariosFilterState['search']>('')
  const [estado, setEstado] = useState<ListadoUsuariosFilterState['estado']>(true)
  const [cuentaConfirmada, setCuentaConfirmada] = useState<ListadoUsuariosFilterState['cuentaConfirmada']>(true)
  const [rol, setRol] = useState<ListadoUsuariosFilterState['rol']>('')
  const [roles, setRoles] = useState<ListadoUsuariosFilterState['roles']>([])

  useEffect(() => {
    obtenerRoles()
  }, [])

  useEffect(() => {
    if (usuarios) {
      let usuariosFiltrados = usuarios.filter(usuario => {
        if (usuario.email.toLowerCase().includes(search.toLowerCase())) {
          return usuario
        }
      })
      if (estado) {
        usuariosFiltrados = usuariosFiltrados.filter(usuario => usuario.estado)
      }
      if (cuentaConfirmada) {
        usuariosFiltrados = usuariosFiltrados.filter(usuario => usuario.cuentaConfirmada)
      }
      if (rol) {
        usuariosFiltrados = usuariosFiltrados.filter(usuario => usuario.rol?.id === Number(rol))
      }
      console.log( 'usuariosFiltrados', usuariosFiltrados )
      setUsuariosFiltered(usuariosFiltrados)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarios, search, estado, cuentaConfirmada, rol])

  const obtenerRoles = async () => {
    try {
      const response = await getRoles()
      setRoles(response)
    } catch (error: any) {
      console.log(error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target
    switch (name) {
      case 'search':
        setSearch(value)
        break
      case 'estado':
        setEstado(!estado)
        break
      case 'cuentaConfirmada':
        setCuentaConfirmada(!cuentaConfirmada)
        break
      case 'rol':
        setRol(value)
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
          placeholder='E-Mail del Usuario'
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
        <span style={{marginRight: '0.5rem'}}>Cuenta confirmada:</span>
        <input
          type="checkbox"
          name='cuentaConfirmada'
          checked={cuentaConfirmada}
          onChange={handleChange}
        />
      </div>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <span style={{marginRight: '0.5rem'}}>Rol:</span>
        <select
          style={{width: '200px'}}
          name="rol"
          value={rol}
          onChange={handleChange}
        >
          <option value="">Todos</option>
          {roles?.map(rol => (
            <option key={rol.id} value={rol.id}>{rol.nombre}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default ListadoUsuariosFilter