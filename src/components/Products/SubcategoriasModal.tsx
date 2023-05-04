import { useEffect, useRef } from 'react'
import { Button, Modal, Form, Input, message } from 'antd';
import { createSubCategory, updateSubCategory } from '@/services/productsService';
import { Categoria } from '@/interfaces/Categoria';
import { SubCategoria } from '@/interfaces/SubCategoria';

interface SubcategoriaModalProps {
  isModalSubcategoriesOpen: boolean;
  setIsModalSubcategoriesOpen: (isModalOpen: boolean) => void;
  categoryId: number;
  subcategoryEdit: SubCategoria | null;
  setSubcategoryEdit: (subcategoryEdit: SubCategoria | null) => void;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} es requerido!',
};

const SubcategoriasModal = ({isModalSubcategoriesOpen, setIsModalSubcategoriesOpen, categoryId, subcategoryEdit, setSubcategoryEdit}: SubcategoriaModalProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const form = useRef<any>(null);

  useEffect(() => {
    if(subcategoryEdit?.id) {
      form.current.setFieldsValue({
        nombre: subcategoryEdit?.nombre,
        descripcion: subcategoryEdit?.descripcion,
      });
    }
  }, [subcategoryEdit])

  const onFinish = async (values: any) => {
    const data: SubCategoria = {
      nombre: values.nombre,
      descripcion: values.descripcion,
      idCategoria: categoryId,
    }
    if(subcategoryEdit?.id) {
      data.id = subcategoryEdit?.id as number;
      updateSubcategoryModal(data);
    } else {
      createSubcategoryModal(data);
    }
  };

  const createSubcategoryModal = async (data: SubCategoria) => {
    try {
      const response = await createSubCategory(data);
      messageApi.open({
        type: 'success',
        content: response.message,
      }).then(() => {
        setIsModalSubcategoriesOpen(false);
      });
    } catch (error: any) {
      messageApi.open({
        type: 'warning',
        content: error.response.data.message,
      });
    }
  }

  const updateSubcategoryModal = async (data: SubCategoria) => {
    try {
      const response = await updateSubCategory(data);
      messageApi.open({
        type: 'success',
        content: response.message,
      }).then(() => {
        setIsModalSubcategoriesOpen(false);
      });
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
    setSubcategoryEdit(null);
    setIsModalSubcategoriesOpen(false);
  }

  return (
    <>
      {contextHolder}
      <Modal title={subcategoryEdit?.id ? 'Editar una subcategoría' : 'Agregar nueva subcategoría'} open={isModalSubcategoriesOpen} destroyOnClose okButtonProps={{ style: {display: 'none'} }} cancelButtonProps={{ style: {display: 'none'} }} onCancel={handleCancel}>
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
                  {subcategoryEdit?.id ? 'Editar' : 'Crear'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default SubcategoriasModal