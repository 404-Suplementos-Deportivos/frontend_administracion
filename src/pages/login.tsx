import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button, Checkbox, Form, Input, Spin, message } from 'antd';
import { UsuarioLogin } from '@/interfaces/UsuarioLogin';
import { ROLES } from '@/interfaces/RolesEnum';
import { useAppSelector, useAppDispatch } from '@/hooks/useReduxStore';
import { setToken, clearUsuarioAuth, setUsuarioAuth } from '@/store/features/auth/authSlice';
import { getProfileAsync } from '@/store/features/auth/authSlice';
import { getProfile } from '@/services/authService';
import { login } from '@/services/authService';
import Icono from '/public/404_Icono.png'

interface LoginState {
  loading: boolean
}

export default function Login() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isAuth, usuario, error } = useAppSelector(state => state.auth)
  const formRef = useRef<any>(null)
  const [loading, setLoading] = useState<LoginState['loading']>(false)
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if(localStorage.getItem('token')) {
      const getProfile = async () => {
        try {
          const token = localStorage.getItem('token')
          dispatch(setToken(token as string))
          await dispatch(getProfileAsync())
        } catch (error: any) {
          messageApi.error(error.response?.data?.message ?? 'Error al obtener perfil')
        }
      }
      getProfile()
    } else {
      dispatch(clearUsuarioAuth())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(isAuth && usuario && usuario.rol === ROLES.ADMIN) {
      router.push('/')
    } else if(isAuth && usuario && usuario.rol !== ROLES.ADMIN) {
      dispatch(clearUsuarioAuth())
      messageApi.error('No tienes permisos para acceder a esta sección')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth, usuario])

  const onFinish = async (values: UsuarioLogin) => {
    setLoading(true)
    try {
      const data  = await login(values)

      if(!data.token) throw new Error('No se pudo obtener el token')
      dispatch(setToken(data.token))

      dispatch(getProfileAsync())
    } catch (error: any) {
      messageApi.error(error.response?.data?.message ?? 'Error al iniciar sesión')
    } finally {
      formRef.current.resetFields()
      setLoading(false)
    }
  };

  return (
    <>
      <Head>
        <title>404 Admin Dashboard - Login</title>
        <meta name="description" content='Panel de Admnistracion de Tienda 404 Suplementos Deportivos' />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/404_Icono_White.ico" />
      </Head>
      {contextHolder}
      <div 
        className='fondo'
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <Image src={Icono} alt='404 Icono' width={100} height={100} />
            <h2 style={{ marginLeft: '20px', fontWeight: 'normal' }}>Admin Dashboard</h2>
          </div>
          <Spin spinning={loading} tip='Cargando...'>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              onFinish={onFinish}
              ref={formRef}
            >
              <Form.Item
                label="E-Mail"
                name="email"
                rules={[{ required: true, message: 'Ingresa tu e-mail!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Ingresa tu password!' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Ingresar
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </div>
    </>
  )
}
