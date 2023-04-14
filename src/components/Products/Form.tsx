import { useRef } from 'react';
import { Button, Form, Input, InputNumber, Select, Space, message } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { createProduct } from '@/services/productsService';
import { Producto } from '@/interfaces/Producto';
import { Categoria } from '@/interfaces/Categoria';
import { Subategoria } from '@/interfaces/SubCategoria';

const { Option } = Select;
const { Search } = Input;

interface FormCreateProps {
  categorias: Categoria[]
  subCategorias: Subategoria[]
  setSelectedCategory: (id: number) => void
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

const FormCreate = ({categorias, subCategorias, setSelectedCategory}: FormCreateProps) => {
  const formRef = useRef<FormInstance>(null);
  const [messageApi, contextHolder] = message.useMessage();

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
    try {
      const data = await createProduct(producto);
      messageApi.open({
        content: data.message,
        duration: 2,
        type: 'success'
      })
      onReset();
    } catch (error: any) {
      console.log( error.response.data.message )
      messageApi.open({
        content: error.response.data.message,
        duration: 2,
        type: 'error'
      })
    }
  };

  const onReset = () => {
    formRef.current?.resetFields();
  };

  const handleChange = (value: string) => {
    setSelectedCategory(Number(value))
  }

  // TODO: Agregar subida de imagenes a servidor
  return (
    <>
      {contextHolder}
      <Form
        {...layout}
        ref={formRef}
        name="control-ref"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        validateMessages={validateMessages}
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
            options={categorias.map(categoria => ({
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
            options={subCategorias.map(subCategoria => ({
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
        
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Cargar Producto
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Limpiar
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default FormCreate