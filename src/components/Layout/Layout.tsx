import {useState, useEffect} from 'react'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  NotificationOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { Breadcrumb, Layout as LayoutComponent, Menu, theme, MenuProps } from 'antd'
import { useAppSelector, useAppDispatch } from '@/hooks/useReduxStore'
import { setUsuarioAuth, setToken, clearUsuarioAuth } from '@/store/features/auth/authSlice'
import { getProfile } from '@/services/authService'


const { Header, Content, Footer, Sider } = LayoutComponent

interface LayoutProps {
  children: React.ReactNode | JSX.Element | JSX.Element[]
  title: string
  description?: string
  desc?: string
}

interface LayoutState {
  collapsed: boolean
  selectedKey: string
}

const desc: string = 'Panel de Admnistracion de Tienda 404 Suplementos Deportivos'

enum ROUTES {
  DASHBOARD = '/',
  COMPRAS = '/compras',
  VENTAS = '/ventas',
  PRODUCTOS = '/productos',
  PRODUCTOS_LIST = '/productos/list',
  PRODUCTOS_CREATE = '/productos/create',
  PRODUCTOS_CATEGORIES = '/productos/categories',
  PRODUCTOS_GANANCIAS = '/productos/ganancias',
  USUARIOS = '/users',
  USUARIOS_LIST = '/users',
  LOGOUT = '/logout'
}

const Layout = ({children, title, description=desc}: LayoutProps) => {
  const [collapsed, setCollapsed] = useState<LayoutState['collapsed']>(false)
  const router = useRouter()
  const [selectedKey, setSelectedKey] = useState<LayoutState['selectedKey']>('');
  const dispatch = useAppDispatch()
  const token = useAppSelector(state => state.auth.token)

  const { pathname } = router

  useEffect(() => {
    if(localStorage.getItem('token')) {
      dispatch(setToken(localStorage.getItem('token') as string))
      const getProfileData = async () => {
        try {
          const data = await getProfile()
          dispatch(setUsuarioAuth(data))
        } catch (error: any) {
          console.log( error.response.data.message )
        }
      }
      getProfileData()
    } else {
      dispatch(clearUsuarioAuth())
    }
  }, [dispatch, token])

  useEffect(() => {
    const path = pathname.split('/')[1]
    setSelectedKey('/' + path)
  }, [pathname])

  // TODO: Agregar Redux-Toolkit con Cargando
  return (
    <>
      <Head>
        <title>{`404 Admin Dashboard - ${title}`}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/404_Icono_White.ico" />
      </Head>

      <LayoutComponent style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div style={{ height: '64px'}}>
            <Link href='/'>
              <Image src={'/404_Icono.png'} alt='Logo' width={64} height={64} style={{width: '100%', objectFit: 'contain'}} />
            </Link>
          </div>
          {selectedKey ? (
            <Menu theme="dark" mode="inline" inlineCollapsed={collapsed} defaultSelectedKeys={[pathname]} selectedKeys={[pathname]} defaultOpenKeys={[selectedKey]}>
              <Menu.Item key="/" icon={<PieChartOutlined />}>
                <Link href='/'>
                  Dashboard
                </Link>
              </Menu.Item>
              <Menu.SubMenu key="compras" icon={<UserOutlined />} title="Compras">
                <Menu.Item key="1">Compras</Menu.Item>
                <Menu.Item key="3">Proveedores</Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key="ventas" icon={<UserOutlined />} title="Ventas">
                <Menu.Item key="5">Ventas</Menu.Item>
                <Menu.Item key="6">Clientes</Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key={ROUTES.PRODUCTOS} icon={<DesktopOutlined />} title="Productos">
                <Menu.Item key={ROUTES.PRODUCTOS_LIST}>
                  <Link href={ROUTES.PRODUCTOS_LIST}>Listado</Link>
                </Menu.Item>
                <Menu.Item key={ROUTES.PRODUCTOS_CREATE}>
                  <Link href={ROUTES.PRODUCTOS_CREATE}>Nuevo Producto</Link>
                </Menu.Item>
                <Menu.Item key={ROUTES.PRODUCTOS_CATEGORIES}>
                  <Link href={ROUTES.PRODUCTOS_CATEGORIES}>Categorias</Link>
                </Menu.Item>
                <Menu.Item key={ROUTES.PRODUCTOS_GANANCIAS}>
                  <Link href={ROUTES.PRODUCTOS_GANANCIAS}>Ganancias</Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key={ROUTES.USUARIOS} icon={<TeamOutlined />} title="Usuarios">
                <Menu.Item key={ROUTES.USUARIOS_LIST}>
                  <Link href={ROUTES.USUARIOS_LIST}>Listado</Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.Item key="logout" icon={<FileOutlined />}>
                <Link href='/'>
                  Salir
                </Link>
              </Menu.Item>
            </Menu>
          ) : null}
        </Sider>
        <LayoutComponent className="site-layout">
          <Header style={{ paddingRight: 40, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', color: 'white', gap: 20}}>
            <NotificationOutlined />
            <SettingOutlined />
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, minHeight: 360}}>
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
        </LayoutComponent>
      </LayoutComponent>
    </>
  )
}

export default Layout