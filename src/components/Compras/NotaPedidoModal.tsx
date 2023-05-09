import { useRef, useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Select, DatePicker, Space, Modal, message, Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import { createNotaPedido, updateNotaPedido, getProveedores, getProductosProveedor } from '@/services/comprasService';
import { NotaPedido } from '@/interfaces/NotaPedido';
import { Proveedor } from '@/interfaces/Proveedor';
import { Producto } from '@/interfaces/Producto';

const { Option } = Select;
const { Search } = Input;

interface NotaPedidoModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  notaPedidoEdit: NotaPedido | null
  setNotaPedidoEdit: (notaPedidoEdit: NotaPedido | null) => void
}

interface NotaPedidoModalState {
  proveedores: Proveedor[];
  selectedTipoCompra: number;
  productos: Producto[];
  selectedProveedor: number;
}

interface TipoCompra {
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
  const [proveedores, setProveedores] = useState<NotaPedidoModalState['proveedores']>([]);
  const [selectedTipoCompra, setSelectedTipoCompra] = useState<NotaPedidoModalState['selectedTipoCompra']>(0);
  const [productos, setProductos] = useState<NotaPedidoModalState['productos']>([]);
  const [selectedProveedor, setSelectedProveedor] = useState<NotaPedidoModalState['selectedProveedor']>(1);
  const [messageApi, contextHolder] = message.useMessage();
  const form = useRef<any>(null);

  const tipoCompra: TipoCompra[] = [
    { value: "1", label: 'Local' },
    { value: "2", label: 'Exterior' },
  ]

  useEffect(() => {
    if(notaPedidoEdit?.id) {
      form.current.setFieldsValue({
        
      });
    }
  }, [notaPedidoEdit])

  useEffect(() => {
    // Consultar API p/ TipoCompras
    fetchProveedores();
    fetchProductosProveedor(selectedProveedor);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  // const onFinish = async (values: any) => {
  //   const notaPedido: NotaPedido = {
      
  //   }
  //   if(notaPedidoEdit?.id) {
  //     notaPedido.id = notaPedidoEdit?.id as number;
  //     updateNotaPedidoModal(notaPedido);
  //   } else {
  //     createNotaPedidoModal(notaPedido);
  //   }
  // };

  const createNotaPedidoModal = async (data: NotaPedido) => {
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

  const updateNotaPedidoModal = async (data: NotaPedido) => {
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

  const handleCancel = () => {
    form.current.resetFields();
    form.current = null
    setNotaPedidoEdit(null);
    setIsModalOpen(false);
  }

  const disabledDate = (current: any) => {
    return current && current < dayjs().endOf('day');
  }

  const columns: ColumnsType<Producto> = [
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
          <InputNumber min={0} defaultValue={0} disabled={notaPedidoEdit?.id ? false : true} />
        </Space>
      ),
      width: '25%',
    },
    {
      title: 'Cantidad Pedida',
      key: 'cantidadPedida',
      render: (text, record) => (
        <Space size="middle">
          <InputNumber min={0} defaultValue={0} />
        </Space>
      ),
      width: '25%',
    },
  ];

  const rowSelection: TableRowSelection<Producto> = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: Producto) => ({
      disabled: record.nombre === 'Disabled Producto',
      name: record.nombre,
    }),
  };

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
          // onFinish={onFinish}
          // style={{ maxWidth: 600 }}
          validateMessages={validateMessages}
          ref={form}
        >
          <Form.Item name="fechaVencimiento" label="Fecha Vencimiento" rules={[{ required: true }]}>
            <DatePicker 
              disabledDate={disabledDate}
            />
          </Form.Item>
          <Form.Item
            name="estadoNP"
            label="Estado"
            rules={[{ required: true, message: 'Selecciona un estado!' }]}
          >
            <Select
              allowClear
              placeholder="Selecciona un estado"
              options = {tipoCompra}
              defaultValue={tipoCompra[0].value}
              onChange={handleChangeTipoCompra}
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
              defaultValue={tipoCompra[0].value}
              onChange={handleChangeTipoCompra}
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
          <Table<Producto>
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