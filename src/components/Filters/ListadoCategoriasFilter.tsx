import {useState, useEffect} from 'react'
import { Categoria } from '@/interfaces/Categoria'

interface ListadoCategoriasFilterProps {
  categorias: Categoria[] | undefined
  categoriasFiltered: Categoria[] | undefined
  setCategoriasFiltered: (categorias: Categoria[]) => void
}

interface ListadoCategoriasFilterState {
  search: string
  estado: boolean
}

const ListadoCategoriasFilter = ({categorias, categoriasFiltered, setCategoriasFiltered}: ListadoCategoriasFilterProps) => {
  const [search, setSearch] = useState<ListadoCategoriasFilterState['search']>('')
  const [estado, setEstado] = useState<ListadoCategoriasFilterState['estado']>(true)

  useEffect(() => {
    if (categorias) {
      let categoriasFiltradas = categorias.filter(categoria => {
        if (categoria.nombre.toLowerCase().includes(search.toLowerCase())) {
          return categoria
        }
      })
      if (estado) {
        categoriasFiltradas = categoriasFiltradas.filter(categoria => categoria.estado)
      }
      setCategoriasFiltered(categoriasFiltradas)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorias, search, estado])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value, checked} = e.target
    switch (name) {
      case 'search':
        setSearch(value)
        break
      case 'estado':
        setEstado(checked)
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
          placeholder='Nombre de la categoría'
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

export default ListadoCategoriasFilter