import { useState, useEffect, Key } from "react"
import Link from "next/link"
import { message, Button, Table, TableProps, Popconfirm } from "antd"
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { CheckBadgeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import Layout from "@/components/Layout/Layout"
import UsuariosModal from "@/components/Users/UsuariosModal";
import { getUsers, deleteUser, confirmAccount } from "@/services/usersService";
import { User } from "@/interfaces/User";

interface UsersState {
  users: User[];
  filteredInfo: Record<string, FilterValue | null>;
  sortedInfo: SorterResult<User>
  lastExpandedRowId: number | null | undefined,
  isModalOpen: boolean;
  usuarioEdit: User | null;
}

export default function Users() {
  const [messageApi, contextHolder] = message.useMessage();
  const [users, setUsers] = useState<User[]>();
  const [filteredInfo, setFilteredInfo] = useState<UsersState['filteredInfo']>({});
  const [sortedInfo, setSortedInfo] = useState<UsersState['sortedInfo']>({});
  const [lastExpandedRowId, setLastExpandedRowId] = useState<UsersState['lastExpandedRowId']>(null);
  const [isModalOpen, setIsModalOpen] = useState<UsersState['isModalOpen']>(false);
  const [usuarioEdit, setUsuarioEdit] = useState<UsersState['usuarioEdit']>(null);

  useEffect(() => {
    fetchUsers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen])

  const fetchUsers = async () => {
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

  const handleOpenModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  const handleChange: TableProps<User>['onChange'] = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<User>);
  };

  const confirmEditUser = async (usuario: User) => {
    setUsuarioEdit(usuario);
    setIsModalOpen(true);
  };

  const confirmDeleteUser = async (id: number) => {
    try {
      const response = await deleteUser(id)
      message.success({ content: response.message, key: 'deleteUser', duration: 3 });
      fetchUsers()
    } catch (error: any) {
      message.error({ content: error.response.data.message , key: 'deleteUser', duration: 3 });
    }
  };

  const confirmAccountUser = async (usuario: User) => {
    try {
      const response = await confirmAccount(Number(usuario?.id))
      message.success({ content: response.message, key: 'accountUser', duration: 3 });
      fetchUsers()
    } catch (error: any) {
      message.error({ content: error.response.data.message , key: 'accountUser', duration: 3 });
    }
  };

  const pagination: TablePaginationConfig = {
    defaultPageSize: 5,
    defaultCurrent: 1,
    pageSizeOptions: ['5', '10', '20', '50'],
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`,
  };

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
          <Popconfirm
            title="Confirmar usuario"
            onConfirm={() => confirmAccountUser(record)}
            okText="Si"
            cancelText="No"
          >
            <Button type="default" size="small" style={{padding: '0px'}}>
              <CheckBadgeIcon style={{width: '24px', height: '24px'}} />
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Editar usuario"
            onConfirm={() => confirmEditUser(record)}
            okText="Si"
            cancelText="No"
          >
            <Button type="default" size="small" style={{padding: '0px'}}>
              <PencilSquareIcon style={{width: '24px', height: '24px'}} />
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Eliminar usuario"
            description="¿Está seguro que desea eliminar este usuario?"
            onConfirm={() => confirmDeleteUser(Number(record?.id))}
            okText="Si"
            cancelText="No"
          >
            <Button type="default" size="small" style={{padding: '0px'}}>
              <TrashIcon style={{width: '24px', height: '24px'}} />
            </Button>
          </Popconfirm>
        </div>
      ),
      width: '20%',
    }
  ];

  const expandedRowRender = (record: User) => {
    const columns: ColumnsType<User> = [
      {
        title: 'Dirección',
        dataIndex: 'direccion',
        render: (direccion) => direccion || '',
        width: '20%',
      },
      {
        title: 'Código Postal',
        dataIndex: 'codigoPostal',
        render: (codigoPostal) => codigoPostal || '',
        width: '20%',
      },
      {
        title: 'Teléfono',
        dataIndex: 'telefono',
        render: (telefono) => telefono || '',
        width: '20%',
      },
      {
        title: 'Fecha de Nacimiento',
        dataIndex: 'fechaNacimiento',
        render: (fechaNacimiento) => fechaNacimiento || '',
        width: '20%',
      },
      {
        title: 'Estado',
        dataIndex: 'estado',
        render: (estado) => estado ? 'Activo' : 'Inactivo',
        width: '20%',
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
        <h2 style={{marginTop: 0}}>Usuarios</h2>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
          <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
            <Button type="primary" onClick={handleOpenModal}>Nuevo Usuario</Button>
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
      {isModalOpen && <UsuariosModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} usuarioEdit={usuarioEdit} setUsuarioEdit={setUsuarioEdit} />}
    </>
  )
}
