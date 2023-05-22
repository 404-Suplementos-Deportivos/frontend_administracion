import {useState, useEffect} from 'react'
import { Producto } from '@/interfaces/Producto'
import { Categoria } from '@/interfaces/Categoria'
import { getCategories } from '@/services/productsService'

interface ListadoProductosFilterProps {
  productos: Producto[] | undefined
  productosFiltered: Producto[] | undefined
  setProductosFiltered: (productos: Producto[]) => void
}

interface ListadoProductosFilterState {
  categorias: Categoria[]
  search: string
  estado: boolean
  stockMenorMinimo: boolean
  categoria: string
}

const ListadoProductosFilter = ({productos, productosFiltered, setProductosFiltered}: ListadoProductosFilterProps) => {
  const [categorias, setCategorias] = useState<ListadoProductosFilterState['categorias']>([])
  const [search, setSearch] = useState<ListadoProductosFilterState['search']>('')
  const [estado, setEstado] = useState<ListadoProductosFilterState['estado']>(true)
  const [stockMenorMinimo, setStockMenorMinimo] = useState<ListadoProductosFilterState['stockMenorMinimo']>(false)
  const [categoria, setCategoria] = useState<ListadoProductosFilterState['categoria']>('')

  useEffect(() => {
    obtenerCategorias()
  }, [])

  useEffect(() => {
    if (productos) {
      let productosFiltrados = productos.filter(producto => {
        if (producto.nombre.toLowerCase().includes(search.toLowerCase())) {
          return producto
        }
      })
      if (estado) {
        productosFiltrados = productosFiltrados.filter(producto => producto.estado)
      }
      if (stockMenorMinimo) {
        productosFiltrados = productosFiltrados.filter(producto => producto.stock < producto.stockMinimo)
      }
      if (categoria) {
        productosFiltrados = productosFiltrados.filter(producto => producto.categoria?.id === Number(categoria))
      }
      console.log( 'productosFiltrados', productosFiltrados )
      setProductosFiltered(productosFiltrados)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productos, search, estado, stockMenorMinimo, categoria])

  const obtenerCategorias = async () => {
    try {
      const response = await getCategories()
      setCategorias(response)
    } catch (error: any) {
      console.log(error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    switch (e.target.name) {
      case 'search':
        setSearch(e.target.value)
        break;
      case 'estado':
        setEstado(!estado)
        break;
      case 'stockMenorMinimo':
        setStockMenorMinimo(!stockMenorMinimo)
        break;
      case 'categoria':
        setCategoria(e.target.value)
        break;
      default:
        break;
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
          placeholder='Nombre del producto'
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
        <span style={{marginRight: '0.5rem'}}>Stock actual menor al mínimo</span>
        <input
          type="checkbox"
          name='stockMenorMinimo'
          checked={stockMenorMinimo}
          onChange={handleChange}
        />
      </div>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <span style={{marginRight: '0.5rem'}}>Categoría:</span>
        <select
          style={{width: '200px'}}
          name="categoria"
          value={categoria}
          onChange={handleChange}
        >
          <option value="">Todas</option>
          {categorias.map((categoria: Categoria) => (
            <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default ListadoProductosFilter