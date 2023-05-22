import { useState, useEffect } from "react"
import Link from "next/link"
import { message, Button, Table, TableProps, Popconfirm } from "antd"
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { ArrowPathRoundedSquareIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import Layout from "@/components/Layout/Layout"
import ProveedoresModal from "@/components/Compras/ProveedoresModal";
import ListadoProveedoresFilter from "@/components/Filters/ListadoProveedoresFilter";
import { getProveedores, deleteProveedor } from "@/services/comprasService"
import { Proveedor } from "@/interfaces/Proveedor";
import { TipoIVA } from "@/interfaces/TipoIVA";

interface ListProveedoresState {
  filteredInfo: Record<string, FilterValue | null>;
  sortedInfo: SorterResult<Proveedor>;
  lastExpandedRowId: number | null | undefined;
  isModalOpen: boolean;
  proveedores: Proveedor[] | undefined;
  proveedoresFiltered: Proveedor[] | undefined;
  proveedorEdit: Proveedor | null;
}

export default function Proveedores() {
  const [messageApi, contextHolder] = message.useMessage();
  const [proveedores, setProveedores] = useState<ListProveedoresState['proveedores']>();
  const [proveedoresFiltered, setProveedoresFiltered] = useState<ListProveedoresState['proveedoresFiltered']>([]);
  const [proveedorEdit, setProveedorEdit] = useState<ListProveedoresState['proveedorEdit']>(null)

  const [filteredInfo, setFilteredInfo] = useState<ListProveedoresState['filteredInfo']>({});
  const [sortedInfo, setSortedInfo] = useState<ListProveedoresState['sortedInfo']>({});
  const [lastExpandedRowId, setLastExpandedRowId] = useState<ListProveedoresState['lastExpandedRowId']>(null);
  const [isModalOpen, setIsModalOpen] = useState<ListProveedoresState['isModalOpen']>(false);

  useEffect(() => {
    fetchProveedores()
  }, [isModalOpen])

  const fetchProveedores = async () => {
    try {
      const response = await getProveedores()
      setProveedores(response)
    } catch (error: any) {
      console.log(error.response.data.message)
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  const handleChange: TableProps<Proveedor>['onChange'] = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<Proveedor>);
  };

  const confirmEditProduct = async (proveedor: Proveedor) => {
    setProveedorEdit(proveedor);
    setIsModalOpen(true);
  }

  const confirmDeleteProduct = async (proveedor: Proveedor) => {
    try {
      const response = await deleteProveedor(proveedor.id as number)
      messageApi.open({
        type: 'success',
        content: response.message,
      }).then(() => {
        fetchProveedores();
      });
    } catch (error: any) {
      messageApi.open({
        type: 'warning',
        content: error.response.data.message,
      });
    }
  }

  const columns: ColumnsType<Proveedor> = [
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
      title: 'E-Mail',
      dataIndex: 'email',
      render: (email) => email || '-',
      width: '20%',
      // width: '10%',
    },
    {
      title: 'Tipo IVA',
      dataIndex: 'tipoIva',
      render: (tipoIva: TipoIVA) => `${tipoIva.nombre} - ${tipoIva.descripcion}` || '-',
      width: '40%',
    },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      render: (acciones, record) => (
        <div>
          <Popconfirm
            title="Editar proveedor"
            onConfirm={() => confirmEditProduct(record)}
            okText="Si"
            cancelText="No"
          >
            <Button type="default" size="small" style={{padding: '0px'}}>
              <PencilSquareIcon style={{width: '24px', height: '24px'}} />
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Eliminar proveedor"
            description="¿Está seguro que desea eliminar este proveedor?"
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
  ]

  const pagination: TablePaginationConfig = {
    defaultPageSize: 5,
    defaultCurrent: 1,
    pageSizeOptions: ['5', '10', '20', '50'],
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`,
  };

  const expandedRowRender = (record: Proveedor) => {
    const columns: ColumnsType<Proveedor> = [
      {
        title: 'Teléfono',
        dataIndex: 'telefono',
        render: (telefono) => telefono || '',
        width: '25%',
      },
      {
        title: 'Dirección',
        dataIndex: 'direccion',
        render: (direccion) => direccion || '',
        width: '25%',
      },
      {
        title: 'Código Postal',
        dataIndex: 'codigoPostal',
        render: (codigoPostal) => codigoPostal?.toString() || '-',
        width: '25%',
      },
      {
        title: 'Estado',
        dataIndex: 'estado',
        render: (estado) => estado ? 'Activo' : 'Inactivo',
        width: '25%',
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
        <h2 style={{marginTop: 0}}>Proveedores</h2>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
          <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
            <Button type="primary" onClick={handleOpenModal}>Crear Proveedor</Button>
          </div>
          <div>
            <ListadoProveedoresFilter proveedores={proveedores} proveedoresFiltered={proveedoresFiltered} setProveedoresFiltered={setProveedoresFiltered} />
            <Table columns={columns} dataSource={proveedoresFiltered} onChange={handleChange} pagination={pagination} rowKey={'id'} expandable={{ 
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
        <ProveedoresModal 
          proveedorEdit={proveedorEdit} 
          setProveedorEdit={setProveedorEdit} 
          isModalOpen={isModalOpen} 
          setIsModalOpen={setIsModalOpen} 
        />
      }
    </>
  )
}
