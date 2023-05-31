import { useEffect, useRef } from 'react'
import { Button, Modal, Form, Input, message } from 'antd';
import { createCategory, updateCategory } from '@/services/productsService';
import { Categoria } from '@/interfaces/Categoria';

interface CategoriaModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  categoryEdit: Categoria | null;
  setCategoryEdit: (categoryEdit: Categoria | null) => void;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} es requerido!',
};

const CategoriasModal = ({isModalOpen, setIsModalOpen, categoryEdit, setCategoryEdit}: CategoriaModalProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const form = useRef<any>(null);

  useEffect(() => {
    if(categoryEdit?.id) {
      form.current.setFieldsValue({
        nombre: categoryEdit?.nombre,
        descripcion: categoryEdit?.descripcion,
      });
    }
  }, [categoryEdit])

  const onFinish = async (values: any) => {
    const data: Categoria = {
      nombre: values.nombre,
      descripcion: values.descripcion,
    }
    if(categoryEdit?.id) {
      data.id = categoryEdit?.id as number;
      updateCategoryModal(data);
    } else {
      createCategoryModal(data);
    }
  };

  const createCategoryModal = async (data: Categoria) => {
    try {
      const response = await createCategory(data);
      messageApi.open({
        type: 'success',
        content: response.message,
      }).then(() => {
        setIsModalOpen(false);
      });
    } catch (error: any) {
      messageApi.open({
        type: 'warning',
        content: error.response?.data?.message ?? 'Error al crear categoría',
      });
    }
  }

  const updateCategoryModal = async (data: Categoria) => {
    try {
      const response = await updateCategory(data);
      messageApi.open({
        type: 'success',
        content: response.message,
      }).then(() => {
        setIsModalOpen(false);
        setCategoryEdit(null);
      });
    } catch (error: any) {
      messageApi.open({
        type: 'warning',
        content: error.response?.data?.message ?? 'Error al actualizar categoría',
      });
    }
  }

  const handleCancel = () => {
    form.current.resetFields();
    form.current = null
    setCategoryEdit(null);
    setIsModalOpen(false);
  }

  return (
    <>
      {contextHolder}
      <Modal title={categoryEdit?.id ? 'Editar una categoría' : 'Agregar nueva categoría'} open={isModalOpen} destroyOnClose okButtonProps={{ style: {display: 'none'} }} cancelButtonProps={{ style: {display: 'none'} }} onCancel={handleCancel}>
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          validateMessages={validateMessages}
          ref={form}
        >
          <Form.Item name={['nombre']} label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={['descripcion']} label="Descripción" rules={[{ required: true }]}>
            <Input.TextArea />
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
                  {categoryEdit?.id ? 'Editar' : 'Crear'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default CategoriasModal