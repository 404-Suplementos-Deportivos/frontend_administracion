import { useRef, useEffect, useState } from 'react';
import { Button, Form, Select, Modal, message } from 'antd';
import { changeState } from '@/services/ventasService';
import { Comprobante } from '@/interfaces/Comprobante';
import { EstadoComprobante } from '@/interfaces/EstadoComprobante';

interface ChangeStateModalProps {
  isModalChangeStateOpen: boolean;
  setIsModalChangeStateOpen: (value: boolean) => void;
  order: Comprobante | null;
  estados: EstadoComprobante[];
}

interface ChangeStateModalState {
  selectedEstadoId: number | null;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
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

const ChangeStateModal = ({isModalChangeStateOpen, setIsModalChangeStateOpen, order, estados}: ChangeStateModalProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const form = useRef<any>(null);
  const [selectedEstadoId, setSelectedEstadoId] = useState<ChangeStateModalState['selectedEstadoId']>(null);

  useEffect(() => {
    setSelectedEstadoId(order?.idEstado || null);
  }, [order])

  const onFinish = async (values: any) => {
    try {
      const response = await changeState(order?.id || 0, selectedEstadoId || 0);
      messageApi.open({
        type: 'success',
        content: response.message,
      });
      setTimeout(() => {
        form.current.resetFields();
        form.current = null
        setIsModalChangeStateOpen(false);
      }, 1500);
    } catch (error: any) {
      messageApi.open({
        type: 'warning',
        content: error.response.data.message,
      });
    }
  }

  const handleCancel = () => {
    form.current.resetFields();
    form.current = null
    setIsModalChangeStateOpen(false);
  }

  return (
    <>
      {contextHolder}
      <Modal title={`Cambiar estado de #${order?.id}`} open={isModalChangeStateOpen} destroyOnClose width={1000} okButtonProps={{ style: {display: 'none'} }} cancelButtonProps={{ style: {display: 'none'} }} onCancel={handleCancel}>
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          // style={{ maxWidth: 600 }}
          validateMessages={validateMessages}
          ref={form}
        >
          <Form.Item
            name="estadoNPId"
            label="Estado de la nota de pedido"
            rules={[{ required: true, message: 'Selecciona un estado!' }]}
            initialValue={order?.idEstado?.toString()}
          >
            <Select
              allowClear
              placeholder="Busca un tipo de compra"
              options = {estados.map((estado) => ({ value: estado.id.toString(), label: estado.nombre }))}
              onChange={(value) => setSelectedEstadoId(parseInt(value))}
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
                  Guardar Cambios
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ChangeStateModal