import { useState } from 'react'
import { Button, Modal, Form, Input, InputNumber, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { createGanancia } from '@/services/productsService';

interface GananciasModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
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
    range: '${label} debe ser entre ${min} y ${max}',
  },
};

const GananciasModal = ({isModalOpen, setIsModalOpen}: GananciasModalProps) => {
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: any) => {
    const data = {
      vigencia: values.vigencia[1].format('YYYY-MM-DD'),
      porcentaje: values.porcentaje,
    }
    try {
      const response = await createGanancia(data);
      setIsModalOpen(false);
    } catch (error: any) {
      messageApi.open({
        type: 'warning',
        content: error.response?.data?.message ?? 'Error al crear ganancia'
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  }

  const { RangePicker } = DatePicker;
  const disabledDate = (current: any) => {
    return current && current < dayjs().endOf('day');
  }

  return (
    <>
      {contextHolder}
      <Modal title="Agregar nueva ganancia" open={isModalOpen} destroyOnClose okButtonProps={{ style: {display: 'none'} }} cancelButtonProps={{ style: {display: 'none'} }} onCancel={handleCancel}>
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          validateMessages={validateMessages}
        >
          <Form.Item name={['vigencia']} label="Vigencia" rules={[{ required: true }]}>
            <RangePicker 
              disabledDate={disabledDate}
              disabled={[true, false]}
              defaultValue={[dayjs(), null]}
            />
          </Form.Item>
          <Form.Item name={['porcentaje']} label="Porcentaje" rules={[{ required: true, type: 'number' }]}>
            <InputNumber min={0} max={100} />
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
                  Agregar
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default GananciasModal