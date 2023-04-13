import { useRef } from 'react';
import { Button, Form, Input, InputNumber, Select, Space } from 'antd';
import type { FormInstance } from 'antd/es/form';

const { Option } = Select;
const { Search } = Input;

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
  },
};

const selectAfter = (
  <Select defaultValue="USD">
    <Option value="USD">$USD</Option>
    <Option value="ARS">$ARS</Option>
  </Select>
)

const FormCreate = () => {
  const formRef = useRef<FormInstance>(null);

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    formRef.current?.resetFields();
  };

  // TODO: Agregar subida de imagenes a servidor
  return (
    <>
      <h2 style={{marginTop: 0}}>Crear un Nuevo Producto</h2>
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
          name="categorias"
          label="Categoría"
          rules={[{ required: true, message: 'Selecciona una categoría!' }]}
        >
          <Select
            showSearch
            allowClear
            placeholder="Busca una categoría"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={[
              {
                value: '1',
                label: 'Not Identified',
              },
              {
                value: '2',
                label: 'Closed',
              },
              {
                value: '3',
                label: 'Communicated',
              },
              {
                value: '4',
                label: 'Identified',
              },
              {
                value: '5',
                label: 'Resolved',
              },
              {
                value: '6',
                label: 'Cancelled',
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="subcategorias"
          label="Sub-Categoría"
          rules={[{ required: true, message: 'Selecciona una sub-categoría!'}]}
        >
          <Select
            showSearch
            allowClear
            placeholder="Busca una sub-categoría"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={[
              {
                value: '1',
                label: 'Not Identified',
              },
              {
                value: '2',
                label: 'Closed',
              },
              {
                value: '3',
                label: 'Communicated',
              },
              {
                value: '4',
                label: 'Identified',
              },
              {
                value: '5',
                label: 'Resolved',
              },
              {
                value: '6',
                label: 'Cancelled',
              },
            ]}
          />
        </Form.Item>
        <Form.Item name="precioLista" label="Precio de Lista" rules={[{ required: true, type: 'number', min: 0, max: 99 }]}>
          <InputNumber addonBefore="$" addonAfter={selectAfter} placeholder='Ej. "2500"' />
        </Form.Item>
        <Form.Item name="stock" label="Stock Disponible" rules={[{ required: true, type: 'number', min: 0, max: 99 }]}>
          <InputNumber placeholder='Ej. "25"' />
        </Form.Item>
        <Form.Item name="stockMinimo" label="Stock Mínimo" rules={[{ required: true, type: 'number', min: 0, max: 99 }]}>
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