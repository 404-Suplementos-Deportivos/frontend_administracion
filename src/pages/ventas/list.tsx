import { useState, useEffect } from "react"
import { message, Button, Table, TableProps, Popconfirm } from "antd"
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ArrowPathRoundedSquareIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import Layout from "@/components/Layout/Layout"
import ChangeStateModal from "@/components/Ventas/ChangeStateModal";
import ListadoVentasFilter from "@/components/Filters/ListadoVentasFilter";
import { getComprobantes, getEstados } from "@/services/ventasService"
import { Comprobante } from "@/interfaces/Comprobante"
import { DetalleComprobante } from "@/interfaces/DetalleComprobante";
import { EstadoComprobante } from "@/interfaces/EstadoComprobante";
import ComprobantePagoPDF from "@/utils/generateComprobantePagoPDF";

interface ListOrdenesState {
  orders: Comprobante[]
  ordersFiltered: Comprobante[]
  estados: EstadoComprobante[]
  filteredInfo: Record<string, FilterValue | null>;
  sortedInfo: SorterResult<Comprobante>;
  lastExpandedRowId: number | null | undefined;
  isModalOpen: boolean;
  isModalChangeStateOpen: boolean;
  orderEdit: Comprobante | null;
}

export default function List() {
  const [messageApi, contextHolder] = message.useMessage();
  const [orders, setOrders] = useState<ListOrdenesState['orders']>([])
  const [ordersFiltered, setOrdersFiltered] = useState<ListOrdenesState['ordersFiltered']>([])
  const [orderEdit, setOrderEdit] = useState<ListOrdenesState['orderEdit']>(null)
  const [estados, setEstados] = useState<ListOrdenesState['estados']>([])

  const [filteredInfo, setFilteredInfo] = useState<ListOrdenesState['filteredInfo']>({});
  const [sortedInfo, setSortedInfo] = useState<ListOrdenesState['sortedInfo']>({});
  const [lastExpandedRowId, setLastExpandedRowId] = useState<ListOrdenesState['lastExpandedRowId']>(null);
  const [isModalOpen, setIsModalOpen] = useState<ListOrdenesState['isModalOpen']>(false);
  const [isModalChangeStateOpen, setIsModalChangeStateOpen] = useState<ListOrdenesState['isModalChangeStateOpen']>(false);

  useEffect(() => {
    fetchComprobantes()
    fetchEstados()
  }, [isModalChangeStateOpen])
  
  const fetchComprobantes = async () => {
    const response  = await getComprobantes()
    setOrders(response.data)
  }

  const fetchEstados = async () => {
    const response  = await getEstados()
    setEstados(response.data)
  }

  const handleChange: TableProps<Comprobante>['onChange'] = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<Comprobante>);
  };

  const handleGenerateComprobantePagoPDF = () => {

  }

  const confirmChangeStateComprobante = async (comprobante: Comprobante) => {
    if(comprobante.estadoFactura === 'PAGADA') {
      return messageApi.open({
        type: 'warning',
        content: 'No se puede cambiar estado de una orden que se encuentre en estado PAGADA',
      });
    }
    setOrderEdit(comprobante)
    setIsModalChangeStateOpen(true)
  }

  const columns: ColumnsType<Comprobante> = [
    {
      title: 'N°',
      dataIndex: 'numeroFactura',
      sorter: (a, b) => (a?.id || 0) - (b?.id || 0),
      render: (id) => id?.toString() || '',
      width: '10%',
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      render: (fecha) => fecha || '-',
      width: '15%',
      // width: '10%',
    },
    {
      title: 'Fecha de Vencimiento',
      dataIndex: 'fechaVencimiento',
      render: (fechaVencimiento) => fechaVencimiento || '-',
      width: '15%',
    },
    {
      title: 'Cliente',
      dataIndex: 'usuario',
      render: (usuario) => `${usuario?.nombre} ${usuario?.apellido} - ${usuario?.email}` || '-',
      width: '40%',
    },
    {
      title: 'Estado',
      dataIndex: 'estadoFactura',
      render: (estadoFactura) => estadoFactura || '-',
      width: '10%',
    },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      render: (acciones, record) => (
        <div>
          {record.estadoFactura === 'PAGADA' && (
            <PDFDownloadLink
              document={<ComprobantePagoPDF comprobante={record} />}
              fileName={`ComprobantePago_${record.numeroFactura}.pdf`}
            >
              <Button type="default" size="small" style={{ padding: '0px', marginRight: '10px' }}>
                <ArrowDownTrayIcon style={{ width: '24px', height: '24px' }} />
              </Button>
            </PDFDownloadLink>
          )}
          <Popconfirm
            title="Cambiar estado"
            description="¿Está seguro que desea cambiar estado?"
            onConfirm={() => confirmChangeStateComprobante(record)}
            okText="Si"
            cancelText="No"
          >
            <Button type="default" size="small" style={{padding: '0px'}}>
              <ArrowPathRoundedSquareIcon style={{width: '24px', height: '24px'}} />
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

  const expandedRowRender = (record: Comprobante) => {
    const detalles: DetalleComprobante[] = record.detalleComprobante || [];
    const columns: ColumnsType<DetalleComprobante> = [
      {
        title: 'Producto',
        dataIndex: 'producto',
        render: (producto) => producto.nombre || '-',
        width: '40%',
      },
      {
        title: 'Cantidad',
        dataIndex: 'cantidad',
        render: (cantidad) => cantidad || '-',
        width: '20%',
      },
      
      {
        title: 'Precio',
        dataIndex: 'precio',
        render: (precio) => `$${precio}` || '$-',
        width: '20%',
      },
      {
        title: 'Descuento',
        dataIndex: 'descuento',
        render: (descuento) => `${descuento}%` || '-',
        width: '20%',
      },
    ];
    return <Table columns={columns} dataSource={detalles} pagination={false} rowKey={'id'} />;
  };

  return (
    <>
      <Layout
        title="Listado de ventas"
      >
        <main>
          {contextHolder}
          <h2 style={{marginTop: 0}}>Ordenes</h2>
          <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <div>
              <ListadoVentasFilter ventas={orders} ventasFiltered={ordersFiltered} setVentasFiltered={setOrdersFiltered} />
              <Table columns={columns} dataSource={ordersFiltered} onChange={handleChange} pagination={pagination} rowKey={'id'} expandable={{ 
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
        </main>
      </Layout>
      {isModalChangeStateOpen &&
        <ChangeStateModal
          isModalChangeStateOpen={isModalChangeStateOpen}
          setIsModalChangeStateOpen={setIsModalChangeStateOpen}
          order={orderEdit}
          key={orderEdit?.id}
          estados={estados}
        />
      }
    </>
  )
}
