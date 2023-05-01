import { useState, useEffect, Key } from "react"
import Link from "next/link"
import { message, Button, Table, TableProps } from "antd"
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { ArrowPathRoundedSquareIcon, PencilSquareIcon, TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import Layout from "@/components/Layout/Layout"
import { getCategories, getSubCategories } from "@/services/productsService"
import { Categoria } from "@/interfaces/Categoria";
import { SubCategoria } from "@/interfaces/SubCategoria";

const columns: ColumnsType<Categoria> = [
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
    width: '30%',
  },
  {
    title: 'Descripción',
    dataIndex: 'descripcion',
    render: (descripcion) => descripcion || '',
    width: '50%',
    // width: '10%',
  },
  {
    title: 'Acciones',
    dataIndex: 'acciones',
    render: (acciones, record) => (
      <div>
        <Button type="default" size="small" style={{padding: '0px'}}>
          <PlusCircleIcon style={{width: '24px', height: '24px'}} />
        </Button>
        <Button type="default" size="small" style={{padding: '0px'}}>
          <PencilSquareIcon style={{width: '24px', height: '24px'}} />
        </Button>
        <Button type="default" size="small" style={{padding: '0px'}}>
          <TrashIcon style={{width: '24px', height: '24px'}} />
        </Button>
      </div>
    ),
    width: '10%',
  }
];

export default function Categories() {
  const [messageApi, contextHolder] = message.useMessage();
  const [categories, setCategories] = useState<Categoria[]>();
  const [subcategories, setSubcategories] = useState<SubCategoria[]>();
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<Categoria>>({});
  const [lastExpandedRowId, setLastExpandedRowId] = useState<number | null | undefined>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseCategories = await getCategories()
        setCategories(responseCategories)
      } catch (error: any) {
        messageApi.open({
          content: 'Error al obtener datos',
          duration: 2,
          type: 'error'
        })
      }
    }
    fetchCategories()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange: TableProps<Categoria>['onChange'] = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<Categoria>);
  };

  const pagination: TablePaginationConfig = {
    defaultPageSize: 5,
    defaultCurrent: 1,
    pageSizeOptions: ['5', '10', '20', '50'],
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`,
  };

  const expandedRowRender = (record: Categoria) => {
    const columnsSubcategories: ColumnsType<SubCategoria> = [
      {
        title: 'Subcategoría',
        dataIndex: 'nombre',
        render: (nombre) => nombre || '',
        width: '20%',
      },
      {
        title: 'Descripción',
        dataIndex: 'descripcion',
        render: (descripcion) => descripcion || '',
        width: '70%',
      },
      {
        title: 'Acciones',
        dataIndex: 'acciones',
        render: (acciones, record) => (
          <div>
            <Button type="default" size="small" style={{padding: '0px'}}>
              <PencilSquareIcon style={{width: '24px', height: '24px'}} />
            </Button>
            <Button type="default" size="small" style={{padding: '0px'}}>
              <TrashIcon style={{width: '24px', height: '24px'}} />
            </Button>
          </div>
        ),
        width: '10%',
      }
    ];
    return <Table columns={columnsSubcategories} dataSource={subcategories} pagination={false} rowKey={'id'} />;
  }
  return (
    <Layout
      title="Categorias"
    >
      <h2 style={{marginTop: 0}}>Categorías</h2>
      <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
          <Button type="primary">Crear Categoría</Button>
        </div>
        <div>
          <Table columns={columns} dataSource={categories} onChange={handleChange} pagination={pagination} rowKey={'id'} expandable={{ 
            expandedRowRender: expandedRowRender,
            onExpand: async (expanded, record) => {
              if (expanded) {
                const responseSubCategories = await getSubCategories(Number(record.id))
                setSubcategories(responseSubCategories)
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
