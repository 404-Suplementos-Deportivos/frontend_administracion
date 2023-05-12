import { useRef, useEffect, useState } from 'react';
import { Button, Form, Select, Modal, message } from 'antd';
import { getEstadosNP , updateStateNotaPedido} from '@/services/comprasService';
import { NotaPedido } from '@/interfaces/NotaPedido';
import { EstadoNP } from '@/interfaces/EstadoNP';

interface ChangeStateModalProps {
  isModalChangeStateOpen: boolean;
  setIsModalChangeStateOpen: (isModalChangeStateOpen: boolean) => void;
  notaPedido: NotaPedido | null;
}

interface ChangeStateModalState {
  estadosNP: EstadoNP[];
  selectedEstadoNPId: number | null;
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


const ChangeStateModal = ({isModalChangeStateOpen, setIsModalChangeStateOpen, notaPedido}: ChangeStateModalProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const form = useRef<any>(null);
  const [estadosNP, setEstadosNP] = useState<ChangeStateModalState['estadosNP']>([]);
  const [selectedEstadoNPId, setSelectedEstadoNPId] = useState<ChangeStateModalState['selectedEstadoNPId']>(null);

  useEffect(() => {
    fetchEstadosNP();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setSelectedEstadoNPId(notaPedido?.estadoNPId || null);
  }, [notaPedido])

  const fetchEstadosNP = async () => {
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
    try {
      const response = await updateStateNotaPedido(notaPedido?.id || 0, selectedEstadoNPId || 0);
      messageApi.open({
        type: 'success',
        content: response.message,
      });
      form.current.resetFields();
      form.current = null
      setIsModalChangeStateOpen(false);
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
      <Modal title={`Cambiar estado de #${notaPedido?.id}`} open={isModalChangeStateOpen} destroyOnClose width={1000} okButtonProps={{ style: {display: 'none'} }} cancelButtonProps={{ style: {display: 'none'} }} onCancel={handleCancel}>
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
            initialValue={notaPedido?.estadoNPId?.toString()}
          >
            <Select
              allowClear
              placeholder="Busca un tipo de compra"
              options = {estadosNP.map((estadoNP) => ({ value: estadoNP.id.toString(), label: estadoNP.nombre }))}
              onChange={(value) => setSelectedEstadoNPId(parseInt(value))}
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