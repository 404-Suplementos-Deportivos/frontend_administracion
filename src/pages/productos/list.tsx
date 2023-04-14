import { useState, useEffect, Key } from "react"
import Link from "next/link"
import { message, Button, Table, TableProps } from "antd"
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { ArrowPathRoundedSquareIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import Layout from "@/components/Layout/Layout"
import { getProducts } from "@/services/productsService"
import { Producto } from "@/interfaces/Producto";

const columns: ColumnsType<Producto> = [
  {
    title: 'Codigo',
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
  // {
  //   title: 'Precio de Venta',
  //   dataIndex: 'precioVenta',
  //   render: (precioVenta) => `$${precioVenta?.toString()}` || '-',
  //   width: '10%',
  // },
  {
    title: 'Stock Minimo',
    dataIndex: 'stockMinimo',
    render: (stockMinimo) => stockMinimo?.toString() || '-',
    width: '20%',
  },
  {
    title: 'Stock Actual',
    dataIndex: 'stock',
    render: (stock) => stock?.toString() || '-',
    width: '20%',
  },
  {
    title: 'Acciones',
    dataIndex: 'acciones',
    render: (acciones, record) => (
      <div>
        <ArrowPathRoundedSquareIcon style={{width: '24px', height: '24px'}} />
        <PencilSquareIcon style={{width: '24px', height: '24px'}} />
        <TrashIcon style={{width: '24px', height: '24px'}} />
      </div>
    ),
    width: '20%',
  }
];

export default function ListProductos() {
  const [messageApi, contextHolder] = message.useMessage();
  const [productos, setProducts] = useState<Producto[]>();
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<Producto>>({});
  const [lastExpandedRowId, setLastExpandedRowId] = useState<number | null | undefined>(null);

  useEffect(() => {
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
    fetchProducts()
  }, [])

  const handleChange: TableProps<Producto>['onChange'] = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<Producto>);
  };

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
        width: '70%',
      },
    ];
    return <Table columns={columns} dataSource={[record]} pagination={false} rowKey={'id'} />
  }

  return (
    <Layout
      title="Productos"
    >
      {contextHolder}
      <h2 style={{marginTop: 0}}>Productos</h2>
      <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Link href='/productos/create'>
            <Button type="primary">Crear Producto</Button>
          </Link>
        </div>
        <div>
          <div>Filtros</div>
          <Table columns={columns} dataSource={productos} onChange={handleChange} pagination={pagination} rowKey={'id'} expandable={{ 
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
  )
}
