import {useState, useEffect} from 'react'
import { Producto } from '@/interfaces/Producto'
import { Categoria } from '@/interfaces/Categoria'
import { SubCategoria } from '@/interfaces/SubCategoria'
import { getCategories, getSubCategories } from '@/services/productsService'

interface ListadoProductosFilterProps {
  productos: Producto[] | undefined
  productosFiltered: Producto[] | undefined
  setProductosFiltered: (productos: Producto[]) => void
}

interface ListadoProductosFilterState {
  categorias: Categoria[]
  subcategorias: SubCategoria[]
  nombre: string
  codigo: string
  estado: boolean
  stockMenorMinimo: boolean
  categoria: string
  subcategoria: string
}

const ListadoProductosFilter = ({productos, productosFiltered, setProductosFiltered}: ListadoProductosFilterProps) => {
  const [categorias, setCategorias] = useState<ListadoProductosFilterState['categorias']>([])
  const [subcategorias, setSubcategorias] = useState<ListadoProductosFilterState['subcategorias']>([])
  const [nombre, setNombre] = useState<ListadoProductosFilterState['nombre']>('')
  const [codigo, setCodigo] = useState<ListadoProductosFilterState['codigo']>('')
  const [estado, setEstado] = useState<ListadoProductosFilterState['estado']>(true)
  const [stockMenorMinimo, setStockMenorMinimo] = useState<ListadoProductosFilterState['stockMenorMinimo']>(false)
  const [categoria, setCategoria] = useState<ListadoProductosFilterState['categoria']>('')
  const [subcategoria, setSubcategoria] = useState<ListadoProductosFilterState['subcategoria']>('')

  useEffect(() => {
    obtenerCategorias()
    obtenerSubcategorias(Number(categoria))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoria])

  useEffect(() => {
    if (productos) {
      let productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(nombre.toLowerCase()))
      productosFiltrados = productosFiltrados.filter(producto => producto.id?.toString().includes(codigo.toLowerCase()))
      if (estado) {
        productosFiltrados = productosFiltrados.filter(producto => producto.estado)
      }
      if (stockMenorMinimo) {
        productosFiltrados = productosFiltrados.filter(producto => producto.stock < producto.stockMinimo)
      }
      if (categoria) {
        if(!subcategoria) setSubcategoria('')
        productosFiltrados = productosFiltrados.filter(producto => producto.categoria?.id === Number(categoria))
      }
      if (subcategoria) {
        productosFiltrados = productosFiltrados.filter(producto => producto.idSubCategoria === Number(subcategoria))
      }
      console.log( 'productosFiltrados', productosFiltrados )
      console.log( 'subcategoria', subcategoria )
      setProductosFiltered(productosFiltrados)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productos, nombre, codigo, estado, stockMenorMinimo, categoria, subcategoria])

  const obtenerCategorias = async () => {
    try {
      const response = await getCategories()
      setCategorias(response)
    } catch (error: any) {
      console.log(error)
    }
  }

  const obtenerSubcategorias = async (idCategoria: number) => {
    try {
      const response = await getSubCategories(idCategoria)
      setSubcategorias(response)
    } catch (error: any) {
      console.log(error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    switch (e.target.name) {
      case 'nombre':
        setNombre(e.target.value)
        break;
      case 'codigo':
        setCodigo(e.target.value)
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
      case 'subcategoria':
        setSubcategoria(e.target.value)
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
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <span style={{marginRight: '0.5rem'}}>Buscar por nombre:</span>
          <input
            style={{width: '200px'}}
            type="text"
            name="nombre"
            placeholder='Nombre del producto'
            value={nombre}
            onChange={handleChange}
          />
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <span style={{marginRight: '0.5rem'}}>Buscar por código:</span>
          <input
            style={{width: '200px'}}
            type="text"
            name="codigo"
            placeholder='Código del producto'
            value={codigo}
            onChange={handleChange}
          />
        </div>
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
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px'}}>
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
        <div style={{display: 'flex', alignItems: 'center'}}>
          <span style={{marginRight: '0.5rem'}}>Subcategoria:</span>
          <select
            style={{width: '200px'}}
            name="subcategoria"
            value={subcategoria}
            onChange={handleChange}
          >
            <option value="">Todas</option>
            {subcategorias.map((subcategoria: SubCategoria) => (
              <option key={subcategoria.id} value={subcategoria.id}>{subcategoria.nombre}</option>
            ))}
          </select>
        </div>
      </div>
      
    </div>
  )
}

export default ListadoProductosFilter