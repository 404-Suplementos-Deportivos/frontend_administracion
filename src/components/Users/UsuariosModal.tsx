import { useState, useEffect, useRef } from 'react'
import { Button, Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import type { DatePickerProps } from 'antd';
import dayjs from 'dayjs';
import { getRoles, createUser, updateUser } from '@/services/usersService';
import { User } from '@/interfaces/User';
import { Rol } from '@/interfaces/Rol';

interface UsuariosModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  usuarioEdit: User | null;
  setUsuarioEdit: (usuarioEdit: User | null) => void;
}

interface UsuariosModalState {
  roles: Rol[];
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} es requerido!',
  types: {
    email: '${label} no es un correo válido!',
    number: '${label} no es un número válido!',
    date: '${label} no es una fecha válida!',
  },
  number: {
    range: '${label} debe encontrarse entre ${min} y ${max}',
  },
};


const UsuariosModal = ({isModalOpen, setIsModalOpen, usuarioEdit, setUsuarioEdit}: UsuariosModalProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [roles, setRoles] = useState<UsuariosModalState['roles']>([]);
  const form = useRef<any>(null);

  useEffect(() => {
    const obtenerRoles = async () => {
      try {
        const response = await getRoles();
        setRoles(response);
      } catch (error: any) {
        messageApi.open({
          type: 'warning',
          content: error.response?.data?.message ?? 'Error al obtener roles'
        });
      }
    }
    obtenerRoles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(usuarioEdit?.id) {
      form.current.setFieldsValue({
        nombre: usuarioEdit?.nombre,
        apellido: usuarioEdit?.apellido,
        email: usuarioEdit?.email,
        password: usuarioEdit?.password ? usuarioEdit?.password : '**********',
        direccion: usuarioEdit?.direccion,
        codigoPostal: usuarioEdit?.codigoPostal,
        telefono: usuarioEdit?.telefono,
        fechaNacimiento: dayjs(usuarioEdit?.fechaNacimiento),
        idRol: usuarioEdit?.idRol,
      });
    }
  }, [usuarioEdit])

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    // console.log(date, dateString);
  };

  const handleChange = (value: string) => {
    // console.log(`selected ${value}`);
  };

  const onFinish = async (values: any) => {
    const data: User = {
      nombre: values.nombre,
      apellido: values.apellido,
      email: values.email,
      password: values.password,
      direccion: values.direccion,
      codigoPostal: values.codigoPostal,
      telefono: values.telefono ? values.telefono : null,
      fechaNacimiento: values.fechaNacimiento ? values.fechaNacimiento.format('YYYY-MM-DD') : null,
      idRol: values.idRol
    }
    if(usuarioEdit?.id) {
      data.id = usuarioEdit?.id as number;
      updateUserModal(data);
    } else {
      createUserModal(data);
    }
  };

  const createUserModal = async (data: User) => {
    try {
      const response = await createUser(data);
      messageApi.open({
        type: 'success',
        content: response.message,
      }).then(() => {
        setIsModalOpen(false);
      });
    } catch (error: any) {
      messageApi.open({
        type: 'warning',
        content: error.response?.data?.message ?? 'Error al crear usuario',
      });
    }
  }

  const updateUserModal = async (data: User) => {
    try {
      const response = await updateUser(data);
      messageApi.open({
        type: 'success',
        content: response.message,
      }).then(() => {
        setIsModalOpen(false);
      });
    } catch (error: any) {
      messageApi.open({
        type: 'warning',
        content: error.response?.data?.message ?? 'Error al actualizar usuario',
      });
    }
  }

  const handleCancel = () => {
    form.current.resetFields();
    form.current = null
    setUsuarioEdit(null);
    setIsModalOpen(false);
  }

  return (
    <>
      {contextHolder}
      <Modal title={usuarioEdit?.id ? 'Editar un usuario' : 'Agregar nuevo usuario'} open={isModalOpen} destroyOnClose okButtonProps={{ style: {display: 'none'} }} cancelButtonProps={{ style: {display: 'none'} }} onCancel={handleCancel}>
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
          <Form.Item name={['apellido']} label="Apellido" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={['email']} label="E-Mail" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name={['password']} label="Password" rules={[{ required: true }]}>
            <Input.Password 
              disabled={usuarioEdit?.id ? true : false}
            />
          </Form.Item>
          <Form.Item name={['direccion']} label="Dirección" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={['codigoPostal']} label="Código Postal" rules={[{ required:true, type: 'number', min: 0, max: 9999 }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item name={['telefono']} label="Teléfono">
            <Input />
          </Form.Item>
          <Form.Item name={['fechaNacimiento']} label="Fecha de Nacimiento" rules={[{ type: 'date' }]}>
            <DatePicker onChange={onChange} />
          </Form.Item>
          <Form.Item name={['idRol']} label="Rol de Usuario" rules={[{ required: true }]}>
            <Select
              defaultValue={roles[0]?.id.toString()}
              style={{ width: 120 }}
              onChange={handleChange}
              options={roles.map((rol) => ({ label: rol.nombre, value: rol.id }))}
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
                  {usuarioEdit?.id ? 'Editar' : 'Crear'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default UsuariosModal