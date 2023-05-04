import { useRef, useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Select, Space, Modal, message } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { createProduct, updateProduct, getCategories, getSubCategories } from '@/services/productsService';
import { Producto } from '@/interfaces/Producto';
import { Categoria } from '@/interfaces/Categoria';
import { SubCategoria } from '@/interfaces/SubCategoria';

const { Option } = Select;
const { Search } = Input;

interface ProductsModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  productoEdit: Producto | null
  setProductoEdit: (productoEdit: Producto | null) => void
}

interface ProductsModalState {
  categories: Categoria[];
  subCategories: SubCategoria[];
  selectedCategory: number;
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

const selectAfter = (
  <Select defaultValue="USD">
    <Option value="USD">$USD</Option>
    <Option value="ARS">$ARS</Option>
  </Select>
)

const ProductsModal = ({productoEdit, setProductoEdit, isModalOpen, setIsModalOpen}: ProductsModalProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const form = useRef<any>(null);
  const [categories, setCategories] = useState<ProductsModalState['categories']>([])
  const [subCategories, setSubCategories] = useState<ProductsModalState['subCategories']>([])
  const [selectedCategory, setSelectedCategory] = useState<ProductsModalState['selectedCategory']>(0)

  useEffect(() => {
    if(productoEdit?.id) {
      form.current.setFieldsValue({
        nombre: productoEdit?.nombre,
        descripcion: productoEdit?.descripcion,
        urlImagen: productoEdit?.urlImagen,
        idCategoria: productoEdit?.idCategoria,
        idSubcategoria: productoEdit?.idSubCategoria,
        precioLista: productoEdit?.precioLista,
        stock: productoEdit?.stock,
        stockMinimo: productoEdit?.stockMinimo,
      });
    }
  }, [productoEdit])

  useEffect(() => {
    const getSubCategoriesData = async () => {
      try {
        const dataSubCategories = await getSubCategories(selectedCategory)
        setSubCategories(dataSubCategories)
      } catch (error: any) {
        messageApi.open({
          content: 'Error al obtener datos',
          duration: 2,
          type: 'error'
        })
      }
    }
    getSubCategoriesData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory])

  useEffect(() => {
    const getCategoriesData = async () => {
      try {
        const dataCategories = await getCategories()
        if(dataCategories[0]?.id) {
          const dataSubCategories = await getSubCategories(dataCategories[0].id)
          setCategories(dataCategories)
          setSubCategories(dataSubCategories)
        }
      } catch (error: any) {
        messageApi.open({
          content: 'Error al obtener datos',
          duration: 2,
          type: 'error'
        })
      }
    }
    getCategoriesData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onFinish = async (values: any) => {
    const producto: Producto = {
      nombre: values.nombre,
      descripcion: values.descripcion,
      urlImagen: values.urlImagen,
      precioLista: Number(values.precioLista),
      idCategoria: Number(values.idCategoria),
      idSubCategoria: Number(values.idSubcategoria),
      stock: Number(values.stock),
      stockMinimo: Number(values.stockMinimo)
    }
    if(productoEdit?.id) {
      producto.id = productoEdit?.id as number;
      updateProductModal(producto);
    } else {
      createProductModal(producto);
    }
  };

  const createProductModal = async (data: Producto) => {
    try {
      const response = await createProduct(data);
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

  const updateProductModal = async (data: Producto) => {
    try {
      const response = await updateProduct(data);
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

  const handleChange = (value: string) => {
    setSelectedCategory(Number(value))
  }

  const handleCancel = () => {
    form.current.resetFields();
    form.current = null
    setProductoEdit(null);
    setIsModalOpen(false);
  }

  return (
    <>
      {contextHolder}
      <Modal title={productoEdit?.id ? 'Editar un producto' : 'Crear nuevo producto'} open={isModalOpen} destroyOnClose okButtonProps={{ style: {display: 'none'} }} cancelButtonProps={{ style: {display: 'none'} }} onCancel={handleCancel}>
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          validateMessages={validateMessages}
          ref={form}
        >
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
            <Input placeholder='Ej. "Whey Proteing 250gr" o "Mancuerna 5kg"' allowClear />
          </Form.Item>
          <Form.Item name="descripcion" label="Descripción" rules={[{ required: true }]}>
            <Input.TextArea placeholder='Ej. "Proteina de suero de leche" o "Mancuerna de 5kg"' allowClear />
          </Form.Item>
          <Form.Item name="urlImagen" label="URL Imagen" rules={[{ required: true }]}>
            <Input addonBefore="https://" addonAfter=".com" allowClear placeholder='Ej. "https://www.google.com.ar"' />
          </Form.Item>
          <Form.Item
            name="idCategoria"
            label="Categoría"
            rules={[{ required: true, message: 'Selecciona una categoría!' }]}
          >
            <Select
              showSearch
              allowClear
              placeholder="Busca una categoría"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={categories.map((categoria: Categoria) => ({
                value: categoria.id,
                label: categoria.nombre
              }))}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            name="idSubcategoria"
            label="Sub-Categoría"
            rules={[{ required: true, message: 'Selecciona una sub-categoría!'}]}
          >
            <Select
              showSearch
              allowClear
              placeholder="Busca una sub-categoría"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={subCategories.map((subCategoria: SubCategoria) => ({
                value: subCategoria.id,
                label: subCategoria.nombre
              }))}
            />
          </Form.Item>
          <Form.Item name="precioLista" label="Precio de Lista" rules={[{ required: true, type: 'number', min: 0 }]}>
            <InputNumber addonBefore="$" addonAfter={selectAfter} placeholder='Ej. "3500.50"' />
          </Form.Item>
          <Form.Item name="stock" label="Stock Disponible" rules={[{ required: true, type: 'number', min: 0, max: 1000 }]}>
            <InputNumber placeholder='Ej. "25"' />
          </Form.Item>
          <Form.Item name="stockMinimo" label="Stock Mínimo" rules={[{ required: true, type: 'number', min: 0, max: 1000 }]}>
            <InputNumber  placeholder='Ej. "5"'/>
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
                  {productoEdit?.id ? 'Editar' : 'Crear'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ProductsModal