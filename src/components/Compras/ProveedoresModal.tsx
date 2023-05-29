import { useRef, useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Select, Space, Modal, message } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { getTiposIVA, getProveedor, createProveedor, updateProveedor } from '@/services/comprasService';
import { Proveedor } from '@/interfaces/Proveedor';
import { TipoIVA } from '@/interfaces/TipoIVA';

const { Option } = Select;
const { Search } = Input;

interface ProveedoresModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  proveedorEdit: Proveedor | null
  setProveedorEdit: (proveedorEdit: Proveedor | null) => void
}

interface ProveedoresModalState {
  tiposIva: TipoIVA[];
  selectedTipoIva: number;
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
    email: '${label} no es un correo válido!',
    number: '${label} no es un número válido!',
  },
  number: {
    range: '${label} debe encontrarse entre ${min} y ${max}',
    min: '${label} debe ser mayor o igual a ${min}',
  },
};

const ProveedoresModal = ({isModalOpen, setIsModalOpen, proveedorEdit, setProveedorEdit}: ProveedoresModalProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const form = useRef<any>(null);
  const [tiposIva, setTiposIva] = useState<ProveedoresModalState['tiposIva']>([])
  const [selectedTipoIva, setSelectedTipoIva] = useState<ProveedoresModalState['selectedTipoIva']>(0)

  useEffect(() => {
    fetchTiposIva();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(proveedorEdit?.id) {
      form.current.setFieldsValue({
        nombre: proveedorEdit.nombre,
        email: proveedorEdit.email,
        telefono: proveedorEdit.telefono,
        direccion: proveedorEdit.direccion,
        codigoPostal: proveedorEdit.codigoPostal,
        tipoIvaId: proveedorEdit.tipoIva?.id as number,
      });
      setSelectedTipoIva(proveedorEdit.tipoIva?.id as number);    }
  }, [proveedorEdit])

  const fetchTiposIva = async () => {
    try {
      const response = await getTiposIVA();
      setTiposIva(response);
    } catch (error: any) {
      messageApi.open({
        content: 'Error al obtener datos',
        duration: 2,
        type: 'error'
      })
    }
  }

  const onFinish = async (values: any) => {
    const proveedor: Proveedor = {
      nombre: values.nombre,
      email: values.email,
      telefono: values.telefono,
      direccion: values.direccion,
      codigoPostal: values.codigoPostal,
      tipoIvaId: selectedTipoIva,
    }
    if(proveedorEdit?.id) {
      proveedor.id = proveedorEdit?.id as number;
      updateProveedorModal(proveedor);
    } else {
      createProveedorModal(proveedor);
    }
  };

  const createProveedorModal = async (data: Proveedor) => {
    try {
      const response = await createProveedor(data);
      messageApi.open({
        type: 'success',
        content: response.message,
      }).then(() => {
        setIsModalOpen(false);
      });
    } catch (error: any) {
      messageApi.open({
        type: 'warning',
        content: error.response?.data?.message ?? 'Error al crear el proveedor',
      });
    }
  }

  const updateProveedorModal = async (data: Proveedor) => {
    try {
      const response = await updateProveedor(data);
      messageApi.open({
        type: 'success',
        content: response.message,
      }).then(() => {
        setIsModalOpen(false);
      });
    } catch (error: any) {
      messageApi.open({
        type: 'warning',
        content: error.response?.data?.message ?? 'Error al actualizar el proveedor',
      });
    }
  }

  const handleChange = (value: string) => {
    setSelectedTipoIva(Number(value))
  }

  const handleCancel = () => {
    form.current.resetFields();
    form.current = null
    setProveedorEdit(null);
    setIsModalOpen(false);
  }

  return (
    <>
      {contextHolder}
      <Modal title={proveedorEdit?.id ? 'Editar un proveedor' : 'Crear nuevo proveedor'} open={isModalOpen} destroyOnClose okButtonProps={{ style: {display: 'none'} }} cancelButtonProps={{ style: {display: 'none'} }} onCancel={handleCancel}>
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          validateMessages={validateMessages}
          ref={form}
        >
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
            <Input placeholder='Ej. "Proveedor S.A."' allowClear />
          </Form.Item>
          <Form.Item name="email" label="E-Mail" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder='Ej. "proveedorsa@gmail.com"' allowClear />
          </Form.Item>
          <Form.Item name="telefono" label="Teléfono" rules={[{ required: true }]}>
            <Input allowClear placeholder='Ej. "3513645123"' />
          </Form.Item>
          <Form.Item name="direccion" label="Dirección" rules={[{ required: true }]}>
            <Input allowClear placeholder='Ej. "Av. Siempreviva 742"' />
          </Form.Item>
          <Form.Item name="codigoPostal" label="Código Postal" rules={[{ required: true, type: 'number', min: 1000 }]}>
            <InputNumber style={{ width: '100%' }} placeholder='Ej. "5000"' />
          </Form.Item>
          <Form.Item
            name="tipoIvaId"
            label="Tipo de Iva"
            rules={[{ required: true, message: 'Selecciona un Tipo de IVA' }]}
          >
            <Select
              showSearch
              allowClear
              placeholder="Agrega Tipo de IVA"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={tiposIva.map((tipoIva: TipoIVA) => ({
                value: tipoIva.id,
                label: tipoIva.descripcion
              }))}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
            }}>
              <Button type="default" style={{ marginRight: '10px' }} onClick={handleCancel}>
                  Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                  {proveedorEdit?.id ? 'Editar' : 'Crear'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ProveedoresModal