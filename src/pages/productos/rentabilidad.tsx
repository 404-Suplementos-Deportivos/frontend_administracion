import { useState, useEffect, Key } from "react"
import Link from "next/link"
import { message, Button, Table, TableProps } from "antd"
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { ArrowPathRoundedSquareIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import Layout from "@/components/Layout/Layout"
import GananciasModal from "@/components/Products/GananciasModal";
import { getGanancias } from "@/services/productsService"
import { Ganancia } from "@/interfaces/Ganancia";

interface GananciasState {
  ganancias: Ganancia[]
  filteredInfo: Record<string, FilterValue | null>
  sortedInfo: SorterResult<Ganancia>
  lastExpandedRowId: number | null | undefined
  isModalOpen: boolean
}

const columns: ColumnsType<Ganancia> = [
  // {
  //   title: 'Código',
  //   dataIndex: 'id',
  //   sorter: (a, b) => (a?.id || 0) - (b?.id || 0),
  //   render: (id) => id?.toString() || '',
  //   width: '10%',
  // },
  {
    title: 'Vigencia',
    dataIndex: 'vigencia',
    render: (vigencia) => vigencia || '',    
    width: '50%',
  },
  {
    title: 'Porcentaje',
    dataIndex: 'porcentaje',
    render: (porcentaje) => `${porcentaje?.toString()}%` || '-',
    width: '50%',
  },
];

export default function Ganancias() {
  const [messageApi, contextHolder] = message.useMessage();
  const [ganancias, setGanancias] = useState<GananciasState['ganancias']>();
  const [filteredInfo, setFilteredInfo] = useState<GananciasState['filteredInfo']>({});
  const [sortedInfo, setSortedInfo] = useState<GananciasState['sortedInfo']>({});
  const [lastExpandedRowId, setLastExpandedRowId] = useState<GananciasState['lastExpandedRowId']>(null);
  const [isModalOpen, setIsModalOpen] = useState<GananciasState['isModalOpen']>(false);

  useEffect(() => {
    fetchProducts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchProducts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen])

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

  const handleChange: TableProps<Ganancia>['onChange'] = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<Ganancia>);
  };

  const handleOpenModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  const pagination: TablePaginationConfig = {
    defaultPageSize: 5,
    defaultCurrent: 1,
    pageSizeOptions: ['5', '10', '20', '50'],
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`,
  };

  return (
    <>
      <Layout
        title="Productos"
      >
        {contextHolder}
        <h2 style={{marginTop: 0}}>Rentabilidad</h2>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
          <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
            <Button type="primary" onClick={handleOpenModal}>Agregar Nueva Rentabilidad</Button>
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
      {isModalOpen && <GananciasModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
    </>
  )
}
