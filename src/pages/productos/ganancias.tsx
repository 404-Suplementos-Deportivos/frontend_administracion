import { useState, useEffect, Key } from "react"
import Link from "next/link"
import { message, Button, Table, TableProps } from "antd"
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { ArrowPathRoundedSquareIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import Layout from "@/components/Layout/Layout"
import { getGanancias } from "@/services/productsService"
import { Ganancia } from "@/interfaces/Ganancia";

const columns: ColumnsType<Ganancia> = [
  {
    title: 'Código',
    dataIndex: 'id',
    sorter: (a, b) => (a?.id || 0) - (b?.id || 0),
    render: (id) => id?.toString() || '',
    width: '10%',
  },
  {
    title: 'Vigencia',
    dataIndex: 'vigencia',
    render: (vigencia) => vigencia || '',    
    width: '45%',
  },
  {
    title: 'Porcentaje',
    dataIndex: 'porcentaje',
    render: (porcentaje) => `${porcentaje?.toString()}%` || '-',
    width: '45%',
  },
];

export default function Ganancias() {
  const [messageApi, contextHolder] = message.useMessage();
  const [ganancias, setGanancias] = useState<Ganancia[]>();
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<Ganancia>>({});
  const [lastExpandedRowId, setLastExpandedRowId] = useState<number | null | undefined>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getGanancias()
        setGanancias(response)
      } catch (error: any) {
        messageApi.open({
          content: 'Error al obtener datos',
          duration: 2,
          type: 'error'
        })
      }
    }
    fetchProducts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange: TableProps<Ganancia>['onChange'] = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<Ganancia>);
  };

  const pagination: TablePaginationConfig = {
    defaultPageSize: 5,
    defaultCurrent: 1,
    pageSizeOptions: ['5', '10', '20', '50'],
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`,
  };

  return (
    <Layout
      title="Productos"
    >
      {contextHolder}
      <h2 style={{marginTop: 0}}>Productos</h2>
      <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
          <Link href='/productos/create'>
            <Button type="primary">Agregar Nueva Ganancia</Button>
          </Link>
        </div>
        <div>
          <div>Filtros</div>
          <Table columns={columns} dataSource={ganancias} onChange={handleChange} pagination={pagination} rowKey={'id'} expandable={{ 
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
