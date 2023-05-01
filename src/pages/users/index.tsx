import { useState, useEffect, Key } from "react"
import Link from "next/link"
import { message, Button, Table, TableProps } from "antd"
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { ArrowPathRoundedSquareIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import Layout from "@/components/Layout/Layout"
import { getUsers } from "@/services/usersService";
import { User } from "@/interfaces/User";

const columns: ColumnsType<User> = [
  {
    title: 'Código',
    dataIndex: 'id',
    sorter: (a, b) => (a?.id || 0) - (b?.id || 0),
    render: (id) => id?.toString() || '',
    width: '10%',
  },
  {
    title: 'Nombre Completo',
    dataIndex: 'nombre',
    render: (index, user) => `${user.apellido} ${user.nombre}` || '', 
    width: '20%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    render: (email) => email || '',
    width: '20%',
  },
  {
    title: 'Cuenta confirmada',
    dataIndex: 'cuentaConfirmada',
    render: (cuentaConfirmada) => cuentaConfirmada ? 'Si' : 'No',
    width: '10%',
  },
  {
    title: 'Rol',
    dataIndex: 'rol',
    render: (rol) => rol.nombre || '',
    width: '20%',
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
    width: '20%',
  }
];

export default function Users() {
  const [messageApi, contextHolder] = message.useMessage();
  const [users, setUsers] = useState<User[]>();
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<User>>({});
  const [lastExpandedRowId, setLastExpandedRowId] = useState<number | null | undefined>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getUsers()
        setUsers(response)
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

  const handleChange: TableProps<User>['onChange'] = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<User>);
  };

  const pagination: TablePaginationConfig = {
    defaultPageSize: 5,
    defaultCurrent: 1,
    pageSizeOptions: ['5', '10', '20', '50'],
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`,
  };

  const expandedRowRender = (record: User) => {
    const columns: ColumnsType<User> = [
      {
        title: 'Dirección',
        dataIndex: 'direccion',
        render: (direccion) => direccion || '',
        width: '25%',
      },
      {
        title: 'Código Postal',
        dataIndex: 'codigoPostal',
        render: (codigoPostal) => codigoPostal || '',
        width: '25%',
      },
      {
        title: 'Teléfono',
        dataIndex: 'telefono',
        render: (telefono) => telefono || '',
        width: '25%',
      },
      {
        title: 'Fecha de Nacimiento',
        dataIndex: 'fechaNacimiento',
        render: (fechaNacimiento) => fechaNacimiento || '',
        width: '25%',
      }
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
        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
          <Link href='/productos/create'>
            <Button type="primary">Crear Producto</Button>
          </Link>
        </div>
        <div>
          <div>Filtros</div>
          <Table columns={columns} dataSource={users} onChange={handleChange} pagination={pagination} rowKey={'id'} expandable={{ 
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
