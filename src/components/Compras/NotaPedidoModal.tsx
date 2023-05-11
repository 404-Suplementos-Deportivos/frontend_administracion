import { useRef, useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Select, DatePicker, Space, Modal, message, Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import { createNotaPedido, updateNotaPedido, getProveedores, getProductosProveedor, getEstadosNP } from '@/services/comprasService';
import { NotaPedido } from '@/interfaces/NotaPedido';
import { DetalleNotaPedido } from '@/interfaces/DetalleNotaPedido';
import { Proveedor } from '@/interfaces/Proveedor';
import { Producto } from '@/interfaces/Producto';
import { ProductoNP } from '@/interfaces/ProductoNP';
import { EstadoNP } from '@/interfaces/EstadoNP';

const { Option } = Select;
const { Search } = Input;

interface IDetalleNotaPedido {
  id?: number;
  fechaVencimiento: string;
  proveedorId: number;
  tipoCompraId: number;
  estadoNPId?: number;
  detalleNotaPedido: DetalleNotaPedido[]
}

interface NotaPedidoModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  notaPedidoEdit: NotaPedido | null
  setNotaPedidoEdit: (notaPedidoEdit: NotaPedido | null) => void
}

interface NotaPedidoModalState {
  proveedores: Proveedor[];
  selectedTipoCompra: number;
  productos: ProductoNP[];
  selectedProveedor: number;
  estadosNP: EstadoNP[];
  selectedDate: string;
  detalle: IDetalleNotaPedido;
  detalleEdit: DetalleNotaPedido[];
}

interface SelectOption {
  value: string;
  label: string;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const validateMessages = {
  required: '${label} es requerido!',
  types: {
    number: '${label} no es un número válido!',
    date: '${label} no es una fecha válida!',
  },
  number: {
    range: '${label} debe encontrarse entre ${min} y ${max}',
    min: '${label} debe ser mayor o igual a ${min}',
  },
};


const NotaPedidoModal = ({isModalOpen, setIsModalOpen, notaPedidoEdit, setNotaPedidoEdit}: NotaPedidoModalProps) => {
  const [productos, setProductos] = useState<NotaPedidoModalState['productos']>([]);
  const [proveedores, setProveedores] = useState<NotaPedidoModalState['proveedores']>([]);
  const [selectedProveedor, setSelectedProveedor] = useState<NotaPedidoModalState['selectedProveedor']>(0);
  const [selectedTipoCompra, setSelectedTipoCompra] = useState<NotaPedidoModalState['selectedTipoCompra']>(0);
  const [selectedDate, setSelectedDate] = useState<NotaPedidoModalState['selectedDate']>(dayjs().format('YYYY-MM-DD') as string);
  const [estadosNP, setEstadosNP] = useState<NotaPedidoModalState['estadosNP']>([]);
  const [detalle, setDetalle] = useState<NotaPedidoModalState['detalle']> ({
    fechaVencimiento: dayjs().format('YYYY-MM-DD'),
    proveedorId: 1,
    tipoCompraId: 1,
    detalleNotaPedido: []
  });
  const [detalleEdit, setDetalleEdit] = useState<NotaPedidoModalState['detalleEdit']>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const form = useRef<any>(null);

  const tipoCompra: SelectOption[] = [
    { value: "1", label: 'Local' },
    { value: "2", label: 'Exterior' },
  ]

  const estadosNPSelect: SelectOption[] = estadosNP.map((estadoNP: EstadoNP) => {
    return {
      value: estadoNP.id.toString(),
      label: estadoNP.nombre
    }
  })

  useEffect(() => {
    // Consultar API p/ TipoCompras
    fetchProveedores();
    fetchProductosProveedor(selectedProveedor);
    fetchEstadoNP();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(notaPedidoEdit?.id) {
      console.log( notaPedidoEdit )
      fetchProveedores();
      fetchProductosProveedor(Number(notaPedidoEdit.proveedorId));
      fetchEstadoNP();
      form.current.setFieldsValue({
        fechaVencimiento: dayjs(notaPedidoEdit.fechaVencimiento),
        proveedorId: notaPedidoEdit.proveedorId,
        tipoCompraId: notaPedidoEdit.tipoCompraId?.toString(),
      });
      setSelectedProveedor(Number(notaPedidoEdit.proveedorId));
      setSelectedTipoCompra(Number(notaPedidoEdit.tipoCompraId));
      setSelectedDate(dayjs(notaPedidoEdit.fechaVencimiento).format('YYYY-MM-DD'));
      if(notaPedidoEdit.detalleNotaPedido) {
        setDetalleEdit(notaPedidoEdit.detalleNotaPedido);
        setDetalle({
          fechaVencimiento: dayjs(notaPedidoEdit.fechaVencimiento).format('YYYY-MM-DD'),
          proveedorId: notaPedidoEdit.proveedorId as number,
          tipoCompraId: notaPedidoEdit.tipoCompraId as number,
          detalleNotaPedido: notaPedidoEdit.detalleNotaPedido
        })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notaPedidoEdit])

  useEffect(() => {
    setDetalle({
      fechaVencimiento: selectedDate,
      proveedorId: selectedProveedor,
      tipoCompraId: selectedTipoCompra,
      detalleNotaPedido: detalle.detalleNotaPedido
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProveedor, selectedTipoCompra, selectedDate])

  const fetchProveedores = async () => {
    try {
      const response = await getProveedores();
      setProveedores(response);
    } catch (error: any) {
      messageApi.open({
        type: 'warning',
        content: error.response.data.message,
      });
    }
  }

  const fetchProductosProveedor = async (idProveedor: number) => {
    try {
      const response = await getProductosProveedor(idProveedor);
      setProductos(response);
    } catch (error: any) {
      messageApi.open({
        type: 'warning',
        content: error.response.data.message,
      });
    }
  }

  const fetchEstadoNP = async () => {
    try {
      const response = await getEstadosNP();
      setEstadosNP(response);
    } catch (error: any) {
      messageApi.open({
        type: 'warning',
        content: error.response.data.message,
      });
    }
  }

  const onFinish = async (values: any) => {
    console.log( detalle )
    if(detalle.detalleNotaPedido.length === 0) return messageApi.open({
      type: 'warning',
      content: 'Debe agregar al menos un producto a la nota de pedido',
    });

    if(notaPedidoEdit?.id) {
      updateNotaPedidoModal({
        id: notaPedidoEdit.id,
        estadoNPId: notaPedidoEdit.estadoNPId,
        tipoCompraId: Number(values.tipoCompraId),
        detalleNotaPedido: detalleEdit,
        fechaVencimiento: detalle.fechaVencimiento,
        proveedorId: detalle.proveedorId
      });
    } else {
      createNotaPedidoModal({
        ...detalle,
        detalleNotaPedido: detalle.detalleNotaPedido.map((detalleNP: any) => {
          return {
            ...detalleNP,
            cantidadRecibida: 0
          }
        })
      });
    }
    
  };

  const createNotaPedidoModal = async (data: IDetalleNotaPedido) => {
    try {
      const response = await createNotaPedido(data);
      messageApi.open({
        type: 'success',
        content: response.message,
      }).then(() => {
        setIsModalOpen(false);
      });
    } catch (error: any) {
      messageApi.open({
        type: 'warning',
        content: error.response.data.message,
      });
    }
  }

  const updateNotaPedidoModal = async (data: IDetalleNotaPedido) => {
    try {
      const response = await updateNotaPedido(data);
      messageApi.open({
        type: 'success',
        content: response.message,
      }).then(() => {
        setIsModalOpen(false);
      });
    } catch (error: any) {
      messageApi.open({
        type: 'warning',
        content: error.response.data.message,
      });
    }
  }

  const handleChangeTipoCompra = (value: string) => {
    setSelectedTipoCompra(Number(value))
  }

  const handleChangeProveedor = (value: string) => {
    setSelectedProveedor(Number(value))
    fetchProductosProveedor(Number(value));
  }

  const handleChangeInput = (record: ProductoNP, value: any, column: string) => {
    const index = detalle.detalleNotaPedido.findIndex(
      (item: any) => item.productoId === record.id
    );
  
    if (value === 0 && index !== -1) { // Eliminar el producto si su cantidad es 0
      setDetalle({
        ...detalle,
        detalleNotaPedido: [
          ...detalle.detalleNotaPedido.slice(0, index),
          ...detalle.detalleNotaPedido.slice(index + 1),
        ],
      });
    } else if (index === -1) { // Agregar el producto si no existe en el array
      setDetalle({
        ...detalle,
        detalleNotaPedido: [
          ...detalle.detalleNotaPedido,
          {
            [column]: value,
            precio: record.precio,
            descuento: 0,
            productoId: record.id,
          },
        ],
      });
    } else { // Actualizar la cantidad del producto existente
      setDetalle({
        ...detalle,
        detalleNotaPedido: [
          ...detalle.detalleNotaPedido.slice(0, index),
          {
            ...detalle.detalleNotaPedido[index],
            [column]: value,
          },
          ...detalle.detalleNotaPedido.slice(index + 1),
        ],
      });
    }
    console.log( detalle )
  };

  const handleCancel = () => {
    form.current.resetFields();
    form.current = null
    setNotaPedidoEdit(null);
    setIsModalOpen(false);
  }

  const disabledDate = (current: any) => {
    return current && current < dayjs().endOf('day');
  }

  const columns: ColumnsType<ProductoNP> = [
    {
      title: 'Nombre del producto',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (nombre) => nombre || '-',
      width: '40%',
    },
    {
      title: 'Precio unitario',
      dataIndex: 'precio',
      key: 'precio',
      render: (precio) => `$${precio}` || '-',
      width: '10%',
    },
    {
      title: 'Cantidad Recibida',
      dataIndex: 'cantidadRecibida',
      key: 'cantidadRecibida',
      render: (text, record) => (
        <Space size="middle">
          <InputNumber min={0}  disabled={notaPedidoEdit?.id ? true : true} defaultValue={0} onChange={(value) => handleChangeInput(record, value, 'cantidadRecibida')} />
        </Space>
      ),
      width: '25%',
    },
    {
      title: 'Cantidad Pedida',
      key: 'cantidadPedida',
      render: (text, record) => (
        <Space size="middle">
          <InputNumber 
            min={0} 
            defaultValue={notaPedidoEdit?.id ? (notaPedidoEdit.detalleNotaPedido?.find((detalleNP: any) => detalleNP.productoId === record.id)?.cantidadPedida || 0) : 0}
            onChange={(value) => handleChangeInput(record, value, 'cantidadPedida')} 
          />
        </Space>
      ),
      width: '25%',
    },
  ];

  const pagination: TablePaginationConfig = {
    defaultPageSize: 5,
    defaultCurrent: 1,
    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`,
  };

  return (
    <>
      {contextHolder}
      <Modal title={notaPedidoEdit?.id ? 'Editar nota de pedido' : 'Crear nota de pedido'} open={isModalOpen} destroyOnClose width={1000} okButtonProps={{ style: {display: 'none'} }} cancelButtonProps={{ style: {display: 'none'} }} onCancel={handleCancel}>
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          // style={{ maxWidth: 600 }}
          validateMessages={validateMessages}
          ref={form}
        >
          <Form.Item name="fechaVencimiento" label="Fecha Vencimiento" rules={[{ required: true }]}>
            <DatePicker 
              disabledDate={disabledDate}
              onChange={(date, dateString) => setSelectedDate(dateString)}
            />
          </Form.Item>
          <Form.Item
            name="tipoCompraId"
            label="Tipo de Compra"
            rules={[{ required: true, message: 'Selecciona un tipo de compra!' }]}
          >
            <Select
              allowClear
              placeholder="Busca un tipo de compra"
              options = {tipoCompra}
              onChange={(value) => handleChangeTipoCompra(value)}
            />
          </Form.Item>
          <Form.Item name="proveedorId" label="Proveedor" rules={[{ required: true, message: 'Selecciona un proveedor!' }]}>
            <Select
              showSearch
              allowClear
              placeholder="Busca un proveedor"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={proveedores.map((proveedor: Proveedor) => ({
                value: proveedor.id,
                label: proveedor.nombre
              }))}
              onChange={handleChangeProveedor}
            />
          </Form.Item>
          <Table<ProductoNP>
            rowKey={(record) => record?.id?.toString() || ''}
            columns={columns}
            dataSource={productos}
            pagination={pagination}
          />
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
            }}>
              <Button type="default" style={{ marginRight: '10px' }} onClick={handleCancel}>
                  Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                  {notaPedidoEdit?.id ? 'Editar' : 'Crear'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default NotaPedidoModal