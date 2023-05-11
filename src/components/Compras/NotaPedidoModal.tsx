import { useRef, useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Select, DatePicker, Space, Modal, message, Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import { createNotaPedido, updateNotaPedido, getProveedores, getProductosProveedor } from '@/services/comprasService';
import { NotaPedido } from '@/interfaces/NotaPedido';
import { DetalleNotaPedido } from '@/interfaces/DetalleNotaPedido';
import { Proveedor } from '@/interfaces/Proveedor';
import { Producto } from '@/interfaces/Producto';
import { ProductoNP } from '@/interfaces/ProductoNP';

const { Option } = Select;
const { Search } = Input;

interface INotaPedidoAPI {
  id?: number;
  fechaVencimiento: string;
  proveedorId?: number;
  tipoCompraId: number;
  estadoNPId?: number;
  detalleNotaPedido: DetalleNotaPedido[];
}

interface NotaPedidoModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  notaPedidoEdit: NotaPedido | null
  setNotaPedidoEdit: (notaPedidoEdit: NotaPedido | null) => void
}

interface NotaPedidoModalState {
  proveedores: Proveedor[];
  productos: ProductoNP[];
  selectedProveedorId: number;
  selectedTipoCompraId: number;
  selectedDate: string;
  notaPedido: INotaPedidoAPI
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
  const [messageApi, contextHolder] = message.useMessage();
  const form = useRef<any>(null);
  const [productos, setProductos] = useState<NotaPedidoModalState['productos']>([]);
  const [proveedores, setProveedores] = useState<NotaPedidoModalState['proveedores']>([]);
  const [selectedProveedorId, setSelectedProveedorId] = useState<NotaPedidoModalState['selectedProveedorId']>(0);
  const [selectedTipoCompraId, setSelectedTipoCompraId] = useState<NotaPedidoModalState['selectedTipoCompraId']>(0);
  const [selectedDate, setSelectedDate] = useState<NotaPedidoModalState['selectedDate']>(dayjs().format('YYYY-MM-DD'));
  const [notaPedido, setNotaPedido] = useState<NotaPedidoModalState['notaPedido']>({
    fechaVencimiento: dayjs().format('YYYY-MM-DD'),
    tipoCompraId: 1,
    detalleNotaPedido: [],
  });

  const tipoCompra: SelectOption[] = [
    { value: "1", label: 'Local' },
    { value: "2", label: 'Exterior' },
  ]

  useEffect(() => {
    // Consultar API p/ TipoCompras
    fetchProveedores();
    fetchProductosProveedor(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setNotaPedido(notaPedido => {
      return {
        ...notaPedido,
        fechaVencimiento: selectedDate,
        proveedorId: selectedProveedorId,
        tipoCompraId: selectedTipoCompraId,
        estadoNPId: notaPedidoEdit?.estadoNPId || 0,
        id: notaPedidoEdit?.id || 0,
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedProveedorId, selectedTipoCompraId]);

  useEffect(() => {
    if(notaPedidoEdit?.id) {
      fetchProveedores();
      fetchProductosProveedor(Number(notaPedidoEdit.proveedorId));

      setSelectedProveedorId(Number(notaPedidoEdit.proveedorId));
      setSelectedTipoCompraId(Number(notaPedidoEdit.tipoCompraId));
      setSelectedDate(dayjs(notaPedidoEdit.fechaVencimiento).format('YYYY-MM-DD'));
      setNotaPedido({
        id: notaPedidoEdit.id,
        fechaVencimiento: dayjs(notaPedidoEdit.fechaVencimiento).format('YYYY-MM-DD'),
        proveedorId: Number(notaPedidoEdit.proveedorId),
        tipoCompraId: Number(notaPedidoEdit.tipoCompraId),
        estadoNPId: Number(notaPedidoEdit.estadoNPId),
        detalleNotaPedido: notaPedidoEdit?.detalleNotaPedido?.map((item: any) => {
          return {
            ...item,
            cantidadRecibida: 0
          }
        })
      });

      form.current.setFieldsValue({
        proveedorId: notaPedidoEdit.proveedorId,
        tipoCompraId: notaPedidoEdit.tipoCompraId?.toString(),
        fechaVencimiento: dayjs(notaPedidoEdit.fechaVencimiento),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notaPedidoEdit])
  
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

  const onFinish = async (values: any) => {
    if(notaPedido.detalleNotaPedido.length === 0) return messageApi.open({
      type: 'warning',
      content: 'Debe agregar al menos un producto a la nota de pedido',
    });

    if(notaPedidoEdit?.id) {
      updateNotaPedidoModal({
        id: notaPedidoEdit.id,
        fechaVencimiento: selectedDate,
        proveedorId: selectedProveedorId,
        tipoCompraId: selectedTipoCompraId,
        estadoNPId: notaPedidoEdit.estadoNPId,
        detalleNotaPedido: notaPedido.detalleNotaPedido.map((item: any) => {
          return {
            ...item,
            cantidadRecibida: 0
          }
        })
      });
    } else {
   
      createNotaPedidoModal({
        fechaVencimiento: selectedDate,
        proveedorId: selectedProveedorId,
        tipoCompraId: selectedTipoCompraId,
        detalleNotaPedido: notaPedido.detalleNotaPedido.map((item: any) => {
          return {
            ...item,
            cantidadRecibida: 0
          }
        })
      });
    }
    
  };

  const createNotaPedidoModal = async (data: INotaPedidoAPI) => {
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

  const updateNotaPedidoModal = async (data: any) => {
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

  const handleChangeInput = (record: ProductoNP, value: any, column: string) => {
    const index = notaPedido.detalleNotaPedido.findIndex(
      (item: any) => item.productoId === record.id
    );
  
    if (value === 0 && index !== -1) { // Eliminar el producto si su cantidad es 0
      setNotaPedido({
        ...notaPedido,
        detalleNotaPedido: [
          ...notaPedido.detalleNotaPedido.slice(0, index),
          ...notaPedido.detalleNotaPedido.slice(index + 1),
        ],
      });
    } else if (index === -1) { // Agregar el producto si no existe en el array
      setNotaPedido({
        ...notaPedido,
        detalleNotaPedido: [
          ...notaPedido.detalleNotaPedido,
          {
            [column]: value,
            precio: record.precio,
            descuento: 0,
            productoId: record.id,
          }
        ],
      });
    } else { // Actualizar la cantidad del producto existente
      setNotaPedido({
        ...notaPedido,
        detalleNotaPedido: [
          ...notaPedido.detalleNotaPedido.slice(0, index),
          {
            ...notaPedido.detalleNotaPedido[index],
            [column]: value,
          },
          ...notaPedido.detalleNotaPedido.slice(index + 1),
        ],
      });
    }
    console.log( notaPedido.detalleNotaPedido )
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
          <InputNumber min={0}  disabled={notaPedidoEdit?.id ? true : true} defaultValue={0}  />
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
              onChange={(value) => setSelectedTipoCompraId(Number(value))}
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
              onChange={(value) => { setSelectedProveedorId(Number(value)); fetchProductosProveedor(value); }}
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