import { useState, useEffect, Key } from "react"
import Link from "next/link"
import { message, Button, Table, TableProps, Popconfirm } from "antd"
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { ArrowPathRoundedSquareIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import Layout from "@/components/Layout/Layout"
import ProductsModal from "@/components/Products/ProductsModal";
import ListadoProductosFilter from "@/components/Filters/ListadoProductosFilter";
import { getProducts, deleteProduct } from "@/services/productsService"
import { Producto } from "@/interfaces/Producto";
import { Categoria } from "@/interfaces/Categoria";
import { SubCategoria } from "@/interfaces/SubCategoria";

interface ListProductosState {
  filteredInfo: Record<string, FilterValue | null>;
  sortedInfo: SorterResult<Producto>;
  lastExpandedRowId: number | null | undefined;
  isModalOpen: boolean;
  productos: Producto[] | undefined;
  productoEdit: Producto | null;
  productosFiltered: Producto[] | undefined;
}

export default function ListProductos() {
  const [messageApi, contextHolder] = message.useMessage();
  const [productos, setProducts] = useState<ListProductosState['productos']>();
  const [productoEdit, setProductoEdit] = useState<ListProductosState['productoEdit']>(null)
  const [productosFiltered, setProductosFiltered] = useState<ListProductosState['productosFiltered']>([]);

  const [filteredInfo, setFilteredInfo] = useState<ListProductosState['filteredInfo']>({});
  const [sortedInfo, setSortedInfo] = useState<ListProductosState['sortedInfo']>({});
  const [lastExpandedRowId, setLastExpandedRowId] = useState<ListProductosState['lastExpandedRowId']>(null);
  const [isModalOpen, setIsModalOpen] = useState<ListProductosState['isModalOpen']>(false);

  useEffect(() => {
    fetchProducts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen])
  
  const fetchProducts = async () => {
    try {
      const response = await getProducts()
      setProducts(response)
    } catch (error: any) {
      messageApi.open({
        content: 'Error al obtener datos',
        duration: 2,
        type: 'error'
      })
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  const handleChange: TableProps<Producto>['onChange'] = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<Producto>);
  };

  const confirmEditProduct = async (producto: Producto) => {
    setProductoEdit(producto);
    setIsModalOpen(true);
  }

  const confirmDeleteProduct = async (producto: Producto) => {
    try {
      const response = await deleteProduct(producto.id as number)
      messageApi.open({
        type: 'success',
        content: response.message,
      }).then(() => {
        fetchProducts();
      });
    } catch (error: any) {
      messageApi.open({
        type: 'warning',
        content: error.response.data.message,
      });
    }
  }

  const columns: ColumnsType<Producto> = [
    {
      title: 'Código',
      dataIndex: 'id',
      sorter: (a, b) => (a?.id || 0) - (b?.id || 0),
      render: (id) => id?.toString() || '',
      width: '10%',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      render: (nombre) => nombre || '',    
      width: '20%',
    },
    {
      title: 'Precio de Lista',
      dataIndex: 'precioLista',
      render: (precioLista) => `$${precioLista?.toString()}` || '-',
      width: '20%',
      // width: '10%',
    },
    {
      title: 'Precio de Venta',
      dataIndex: 'precioVenta',
      render: (precioVenta) => `$${precioVenta?.toString()}` || '-',
      width: '20%',
    },
    {
      title: 'Stock Minimo',
      dataIndex: 'stockMinimo',
      render: (stockMinimo) => stockMinimo?.toString() || '-',
      width: '10%',
    },
    {
      title: 'Stock Actual',
      dataIndex: 'stock',
      render: (stock) => stock?.toString() || '-',
      width: '10%',
    },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      render: (acciones, record) => (
        <div>
          <Popconfirm
            title="Editar producto"
            onConfirm={() => confirmEditProduct(record)}
            okText="Si"
            cancelText="No"
          >
            <Button type="default" size="small" style={{padding: '0px'}}>
              <PencilSquareIcon style={{width: '24px', height: '24px'}} />
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Eliminar producto"
            description="¿Está seguro que desea eliminar este producto?"
            onConfirm={() => confirmDeleteProduct(record)}
            okText="Si"
            cancelText="No"
          >
            <Button type="default" size="small" style={{padding: '0px'}}>
              <TrashIcon style={{width: '24px', height: '24px'}} />
            </Button>
          </Popconfirm>
        </div>
      ),
      width: '10%',
    }
  ];

  const pagination: TablePaginationConfig = {
    defaultPageSize: 5,
    defaultCurrent: 1,
    pageSizeOptions: ['5', '10', '20', '50'],
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`,
  };

  const expandedRowRender = (record: Producto) => {
    const columns: ColumnsType<Producto> = [
      {
        title: 'Categoría',
        dataIndex: 'categoria',
        render: (categoria) => categoria?.nombre || '',
        width: '15%',
      },
      {
        title: 'Subcategoría',
        dataIndex: 'subcategoria',
        render: (subcategoria) => subcategoria?.nombre || '',
        width: '15%',
      },
      {
        title: 'Descripción',
        dataIndex: 'descripcion',
        render: (descripcion) => descripcion || '',
        width: '60%',
      },
      {
        title: 'Estado',
        dataIndex: 'estado',
        render: (estado) => estado ? 'Activo' : 'Inactivo',
        width: '10%',
      }
    ];
    return <Table columns={columns} dataSource={[record]} pagination={false} rowKey={'id'} />
  }

  return (
    <>
      <Layout
        title="Productos"
      >
        {contextHolder}
        <h2 style={{marginTop: 0}}>Productos</h2>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
          <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
            <Button type="primary" onClick={handleOpenModal}>Crear Producto</Button>
          </div>
          <div>
            <ListadoProductosFilter productos={productos} productosFiltered={productosFiltered} setProductosFiltered={setProductosFiltered} />
            <Table columns={columns} dataSource={productosFiltered} onChange={handleChange} pagination={pagination} rowKey={'id'} expandable={{ 
              expandedRowRender: expandedRowRender,
              onExpand: (expanded, record) => {
                if (expanded) {
                  setLastExpandedRowId(record.id);
                } else {
                  setLastExpandedRowId(null);
                }
              },
              expandedRowKeys: [lastExpandedRowId || ''],
            }}
            />
          </div>
        </div>
      </Layout>
      {isModalOpen && 
        <ProductsModal 
          productoEdit={productoEdit} 
          setProductoEdit={setProductoEdit} 
          isModalOpen={isModalOpen} 
          setIsModalOpen={setIsModalOpen} 
        />
      }
    </>
  )
}
