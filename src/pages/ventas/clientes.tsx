import { useState, useEffect } from "react"
import { message, Button, Table, TableProps, Popconfirm } from "antd"
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { ArrowPathRoundedSquareIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import Layout from "@/components/Layout/Layout"
import { getClientes, deleteUser } from "@/services/ventasService"
import { Cliente } from "@/interfaces/Cliente";

interface ListClientesState {
  clientes: Cliente[]
  filteredInfo: Record<string, FilterValue | null>;
  sortedInfo: SorterResult<Cliente>;
  lastExpandedRowId: number | null | undefined;
  isModalOpen: boolean;
  isModalChangeStateOpen: boolean;
}

export default function Clientes() {
  const [messageApi, contextHolder] = message.useMessage();
  const [clientes, setClientes] = useState<ListClientesState['clientes']>([])

  const [filteredInfo, setFilteredInfo] = useState<ListClientesState['filteredInfo']>({});
  const [sortedInfo, setSortedInfo] = useState<ListClientesState['sortedInfo']>({});
  const [lastExpandedRowId, setLastExpandedRowId] = useState<ListClientesState['lastExpandedRowId']>(null);
  const [isModalOpen, setIsModalOpen] = useState<ListClientesState['isModalOpen']>(false);
  const [isModalChangeStateOpen, setIsModalChangeStateOpen] = useState<ListClientesState['isModalChangeStateOpen']>(false);

  useEffect(() => {
    fetchClientes()
  }, [isModalChangeStateOpen])

  const fetchClientes = async () => {
    const response  = await getClientes()
    setClientes(response.result)
  }

  const handleChange: TableProps<Cliente>['onChange'] = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<Cliente>);
  };

  const changeStateCliente = (id: number) => {
    setTimeout(async () => {
      try {
        const response = await deleteUser(id)
        messageApi.success(response.message)
        fetchClientes()
      } catch (error: any) {
        messageApi.error(error.response.data.message)
      }
    }, 1000)
  }

  const columns: ColumnsType<Cliente> = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: (a, b) => (a?.id || 0) - (b?.id || 0),
      render: (id) => id?.toString() || '',
      width: '10%',
    },
    {
      title: 'Cliente',
      dataIndex: 'nombre',
      render: (index, cliente) => `${cliente.nombre} ${cliente.apellido}` || '-',
      width: '20%',
      // width: '10%',
    },
    {
      title: 'E-Mail',
      dataIndex: 'email',
      render: (email) => email || '-',
      width: '200%',
    },
    {
      title: 'Dirección',
      dataIndex: 'direccion',
      render: (index, cliente) => `${cliente.direccion} - ${cliente.codigoPostal}` || '-',
      width: '20%',
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      render: (telefono) => telefono || '-',
      width: '10%',
    },
    {
      title: 'Fecha de Nacimiento',
      dataIndex: 'fechaNacimiento',
      render: (fechaNacimiento) => fechaNacimiento || '-',
      width: '10%',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      render: (estado) => estado ? 'Activo' : 'Inactivo' || '-',
      width: '5%',
    },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      render: (acciones, record) => (
        <div>
          <Popconfirm
            title={record.estado ? '¿Está seguro que desea desactivar el cliente?' : '¿Está seguro que desea activar el cliente?'}
            description={record.estado ? 'El cliente se desactivará y no podrá ser utilizado en el sistema' : 'El cliente se activará y podrá ser utilizado en el sistema'}
            onConfirm={() => changeStateCliente(Number(record.id))}
            okText="Si"
            cancelText="No"
          >
            <Button type="default" size="small" style={{padding: '0px'}}>
              <ArrowPathRoundedSquareIcon style={{width: '24px', height: '24px'}} />
            </Button>
          </Popconfirm>
        </div>
      ),
      width: '5%',
    }
  ];

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
        title="Listado de clientes"
      >
        <main>
          {contextHolder}
          <h2 style={{marginTop: 0}}>Clientes</h2>
          <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <div>
              <div>Filtros</div>
              <Table columns={columns} dataSource={clientes} onChange={handleChange} pagination={pagination} rowKey={'id'} />
            </div>
          </div>
        </main>
      </Layout>
      {/* {isModalChangeStateOpen &&
        <ChangeStateModal
          isModalChangeStateOpen={isModalChangeStateOpen}
          setIsModalChangeStateOpen={setIsModalChangeStateOpen}
          order={orderEdit}
          key={orderEdit?.id}
          estados={estados}
        />
      } */}
    </>
  )
}
