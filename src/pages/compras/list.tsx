import { useState, useEffect, Key } from "react"
import Link from "next/link"
import { message, Button, Table, TableProps, Popconfirm } from "antd"
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ArrowPathRoundedSquareIcon, PencilSquareIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import Layout from "@/components/Layout/Layout"
import NotaPedidoModal from "@/components/Compras/NotaPedidoModal";
import ChangeStateModal from "@/components/Compras/ChangeStateModal";
import ListadoComprasFilter from "@/components/Filters/ListadoComprasFilter";
import { getNotasPedido } from "@/services/comprasService";
import { NotaPedido } from "@/interfaces/NotaPedido";
import { DetalleNotaPedido } from "@/interfaces/DetalleNotaPedido";
import NotaPedidoPDF from "@/utils/generateNotaPedidoPDF";
import ListadoNotasPedidoPDF from "@/utils/generateListadoComprasPDF";

interface ListNotasPedidoState {
  filteredInfo: Record<string, FilterValue | null>;
  sortedInfo: SorterResult<NotaPedido>;
  lastExpandedRowId: number | null | undefined;
  isModalOpen: boolean;
  isModalChangeStateOpen: boolean;
  notasPedido: NotaPedido[] | undefined;
  notasPedidoFiltered: NotaPedido[] | undefined;
  notaPedidoEdit: NotaPedido | null;
  data: {
    fechaDesde: string | null;
    fechaHasta: string | null;
    fechaVencimientoDesde: string | null;
    fechaVencimientoHasta: string | null;
    estado: string | null;
    tipoCompra: string | null;
  }
}

export default function List() {
  const [messageApi, contextHolder] = message.useMessage();
  const [notasPedido, setNotasPedido] = useState<ListNotasPedidoState['notasPedido']>();
  const [notasPedidoFiltered, setNotasPedidoFiltered] = useState<ListNotasPedidoState['notasPedidoFiltered']>([]);
  const [notaPedidoEdit, setNotaPedidoEdit] = useState<ListNotasPedidoState['notaPedidoEdit']>(null)
  const [data, setData] = useState<ListNotasPedidoState['data']>({
    fechaDesde: null,
    fechaHasta: null,
    fechaVencimientoDesde: null,
    fechaVencimientoHasta: null,
    estado: null,
    tipoCompra: null,
  })

  const [filteredInfo, setFilteredInfo] = useState<ListNotasPedidoState['filteredInfo']>({});
  const [sortedInfo, setSortedInfo] = useState<ListNotasPedidoState['sortedInfo']>({});
  const [lastExpandedRowId, setLastExpandedRowId] = useState<ListNotasPedidoState['lastExpandedRowId']>(null);
  const [isModalOpen, setIsModalOpen] = useState<ListNotasPedidoState['isModalOpen']>(false);
  const [isModalChangeStateOpen, setIsModalChangeStateOpen] = useState<ListNotasPedidoState['isModalChangeStateOpen']>(false);

  useEffect(() => {
    fetchNotasPedido()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, isModalChangeStateOpen])

  const fetchNotasPedido = async () => {
    try {
      const response = await getNotasPedido()
      setNotasPedido(response)
    } catch (error: any) {
      console.log(error)
      messageApi.open({
        content: error.response?.data?.message ?? 'Error al obtener las notas de pedido',
        duration: 2,
        type: 'error'
      })
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  const handleChange: TableProps<NotaPedido>['onChange'] = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<NotaPedido>);
  };

  const confirmEditNP = async (notaPedido: NotaPedido) => {
    if(notaPedido.estadoNP === 'PEND_ACEPTACION') {
      setNotaPedidoEdit(notaPedido)
      handleOpenModal()
    } else {
      messageApi.open({
        type: 'warning',
        content: 'No se puede editar una nota de pedido que no se encuentre en estado PEND_ACEPTACION',
      });
    }
  }

  const confirmChangeStateNP = async (notaPedido: NotaPedido) => {
    if(notaPedido.estadoNP === 'RECHAZADA') {
      return messageApi.open({
        type: 'warning',
        content: 'No se puede cambiar estado de una nota de pedido que no se encuentre en estado PEND_ACEPTACION',
      });
    }
    setNotaPedidoEdit(notaPedido)
    setIsModalChangeStateOpen(true)
  }

  const columns: ColumnsType<NotaPedido> = [
    {
      title: 'Código',
      dataIndex: 'id',
      sorter: (a, b) => (a?.id || 0) - (b?.id || 0),
      render: (id) => id?.toString() || '',
      width: '10%',
    },
    {
      title: 'Versión',
      dataIndex: 'version',
      render: (version) => version || '-',    
      width: '10%',
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      render: (fecha) => fecha || '-',
      width: '10%',
      // width: '10%',
    },
    {
      title: 'Fecha de Vencimiento',
      dataIndex: 'fechaVencimiento',
      render: (fechaVencimiento) => fechaVencimiento || '-',
      width: '10%',
    },
    {
      title: 'Proveedor',
      dataIndex: 'proveedor',
      render: (proveedor) => proveedor || '-',
      width: '20%',
    },
    {
      title: 'Estado',
      dataIndex: 'estadoNP',
      render: (estadoNP) => estadoNP || '-',
      width: '10%',
    },
    {
      title: 'Tipo de Compra',
      dataIndex: 'tipoCompra',
      render: (estadoNP) => estadoNP || '-',
      width: '20%',
    },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      render: (acciones, record) => (
        <div>
          {record.estadoNP === 'CERRADA' && (
            <PDFDownloadLink
              document={<NotaPedidoPDF notaPedido={record} />}
              fileName={`NotaPedido_${record.id}.pdf`}
            >
              <Button type="default" size="small" style={{ padding: '0px', marginRight: '10px' }}>
                <ArrowDownTrayIcon style={{ width: '24px', height: '24px' }} />
              </Button>
            </PDFDownloadLink>
          )}
          <Popconfirm
            title="Cambiar estado"
            description="¿Está seguro que desea cambiar estado?"
            onConfirm={() => confirmChangeStateNP(record)}
            okText="Si"
            cancelText="No"
          >
            <Button type="default" size="small" style={{padding: '0px', marginRight: '10px'}}>
              <ArrowPathRoundedSquareIcon style={{width: '24px', height: '24px'}} />
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Editar nota de pedido"
            onConfirm={() => confirmEditNP(record)}
            okText="Si"
            cancelText="No"
          >
            <Button type="default" size="small" style={{padding: '0px'}}>
              <PencilSquareIcon style={{width: '24px', height: '24px'}} />
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

  const expandedRowRender = (record: NotaPedido) => {
    const detalles: DetalleNotaPedido[] = record.detalleNotaPedido || [];
    const columns: ColumnsType<DetalleNotaPedido> = [
      {
        title: 'Producto',
        dataIndex: 'producto',
        render: (producto) => producto || '-',
        width: '40%',
      },
      {
        title: 'Cantidad Pedida',
        dataIndex: 'cantidadPedida',
        render: (cantidadPedida) => cantidadPedida || '-',
        width: '20%',
        align: 'right',
      },
      {
        title: 'Cantidad Recibida',
        dataIndex: 'cantidadRecibida',
        render: (cantidadRecibida) => cantidadRecibida || '-',
        width: '20%',
        align: 'right',
      },
      {
        title: 'Precio',
        dataIndex: 'precio',
        render: (precio) => `$${precio.toFixed(2)}` || '$-',
        width: '10%',
        align: 'right',
      },
      {
        title: 'Descuento',
        dataIndex: 'descuento',
        render: (descuento) => `${descuento}%` || '-%',
        width: '10%',
        align: 'right',
      }
    ];
    return <Table columns={columns} dataSource={detalles} pagination={false} rowKey={'id'} />;
  };

  return (
    <>
      <Layout
        title="Compras"
      >
        {contextHolder}
        <h2 style={{marginTop: 0}}>Compras</h2>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
          <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', gap: '10px'}}>
            <Button type="primary" onClick={handleOpenModal}>Generar Nota de Pedido</Button>
            {notasPedidoFiltered?.length ? (
              <PDFDownloadLink
                document={<ListadoNotasPedidoPDF notasPedidoFiltered={notasPedidoFiltered} data={data} />}
                fileName={`ListadoNotasPedido.pdf`}
              >
                <Button type="primary">Imprimir Reporte</Button>
              </PDFDownloadLink>
            ) : null}
          </div>
          <div>
            <ListadoComprasFilter compras={notasPedido} comprasFiltered={notasPedidoFiltered} setComprasFiltered={setNotasPedidoFiltered} setData={setData} />
            <Table columns={columns} dataSource={notasPedidoFiltered} onChange={handleChange} pagination={pagination} rowKey={'id'} expandable={{ 
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
        <NotaPedidoModal 
          notaPedidoEdit={notaPedidoEdit} 
          setNotaPedidoEdit={setNotaPedidoEdit} 
          isModalOpen={isModalOpen} 
          setIsModalOpen={setIsModalOpen} 
          key={notaPedidoEdit?.id}
        />
      }
      {isModalChangeStateOpen &&
        <ChangeStateModal
          isModalChangeStateOpen={isModalChangeStateOpen}
          setIsModalChangeStateOpen={setIsModalChangeStateOpen}
          notaPedido={notaPedidoEdit}
          setNotaPedidoEdit={setNotaPedidoEdit} 
          key={notaPedidoEdit?.id}
        />
      }
    </>
  )
}
