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
import { Breadcrumb, Layout as LayoutComponent, Menu, Badge, notification } from 'antd'
import { ROLES } from '@/interfaces/RolesEnum';
import { useAppSelector, useAppDispatch } from '@/hooks/useReduxStore'
import { setUsuarioAuth, setToken, clearUsuarioAuth } from '@/store/features/auth/authSlice'
import { getProfile } from '@/services/authService'
import { getStockMenorStockMinimo } from '@/services/reportesService'


const { Header, Content, Footer, Sider } = LayoutComponent

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface LayoutProps {
  children: React.ReactNode | JSX.Element | JSX.Element[]
  title: string
  description?: string
  desc?: string
}

interface LayoutState {
  collapsed: boolean
  selectedKey: string
  productosStockMinimo: any
}

const desc: string = 'Panel de Admnistracion de Tienda 404 Suplementos Deportivos'

enum ROUTES {
  DASHBOARD = '/',
  PRODUCTOS = '/productos',
  PRODUCTOS_LIST = '/productos/list',
  PRODUCTOS_CATEGORIES = '/productos/categories',
  PRODUCTOS_RENTABILIDAD = '/productos/rentabilidad',
  COMPRAS = '/compras',
  COMPRAS_LIST = '/compras/list',
  COMPRAS_PROVEEDORES = '/compras/proveedores',
  VENTAS = '/ventas',
  VENTAS_LIST = '/ventas/list',
  VENTAS_CLIENTES = '/ventas/clientes',
  USUARIOS = '/users',
  USUARIOS_LIST = '/users',
  LOGOUT = '/logout'
}

const Layout = ({children, title, description=desc}: LayoutProps) => {
  const [collapsed, setCollapsed] = useState<LayoutState['collapsed']>(false)
  const [selectedKey, setSelectedKey] = useState<LayoutState['selectedKey']>('');
  const [productosStockMinimo, setProductosStockMinimo] = useState<LayoutState['productosStockMinimo']>([])
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [api, contextHolder] = notification.useNotification();
  const { token, usuario } = useAppSelector(state => state.auth)

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
      router.push('/login')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    obtenerStockMenorStockMinimo()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(usuario && usuario.rol !== ROLES.ADMIN) {
      dispatch(clearUsuarioAuth())
      router.push('/login')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario])

  useEffect(() => {
    const path = pathname.split('/')[1]
    setSelectedKey('/' + path)
  }, [pathname])

  const obtenerStockMenorStockMinimo = async () => {
    try {
      const { data } = await getStockMenorStockMinimo()
      setProductosStockMinimo(data)
      if(data.length > 0) {
        openNotificationWithIcon('warning', data)
      }
    } catch (error: any) {
      console.log( error.response.data.message )
    }
  }

  const openNotificationWithIcon = (type: NotificationType, productos: any) => {
    api[type]({
      message: 'Alerta de Productos con Stock Minimo',
      description: (
        <div>
          {productos.map((producto: any) => (
            <div key={producto.id}>
              #{producto.id} {producto.nombre} - Stock: {producto.stock} Min.({producto.stock_minimo})
            </div>
          ))}
        </div>
      ),
      duration: 0,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token')
    dispatch(clearUsuarioAuth())
    router.push('/login')
  }

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
              <Menu.Item key={ROUTES.DASHBOARD} icon={<PieChartOutlined />}>
                <Link href={ROUTES.DASHBOARD}>
                  Dashboard
                </Link>
              </Menu.Item>
              <Menu.SubMenu key={ROUTES.COMPRAS} icon={<UserOutlined />} title="Compras">
                <Menu.Item key={ROUTES.COMPRAS_LIST}>
                  <Link href={ROUTES.COMPRAS_LIST}>Listado</Link>
                </Menu.Item>
                <Menu.Item key={ROUTES.COMPRAS_PROVEEDORES}>
                  <Link href={ROUTES.COMPRAS_PROVEEDORES}>Proveedores</Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key={ROUTES.VENTAS} icon={<UserOutlined />} title="Ventas">
                <Menu.Item key={ROUTES.VENTAS_LIST}>
                  <Link href={ROUTES.VENTAS_LIST}>Listado</Link>
                </Menu.Item>
                <Menu.Item key={ROUTES.VENTAS_CLIENTES}>
                  <Link href={ROUTES.VENTAS_CLIENTES}>Clientes</Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key={ROUTES.PRODUCTOS} icon={<DesktopOutlined />} title="Productos">
                <Menu.Item key={ROUTES.PRODUCTOS_LIST}>
                  <Link href={ROUTES.PRODUCTOS_LIST}>Listado</Link>
                </Menu.Item>
                <Menu.Item key={ROUTES.PRODUCTOS_CATEGORIES}>
                  <Link href={ROUTES.PRODUCTOS_CATEGORIES}>Categorias</Link>
                </Menu.Item>
                <Menu.Item key={ROUTES.PRODUCTOS_RENTABILIDAD}>
                  <Link href={ROUTES.PRODUCTOS_RENTABILIDAD}>Rentabilidad</Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key={ROUTES.USUARIOS} icon={<TeamOutlined />} title="Usuarios">
                <Menu.Item key={ROUTES.USUARIOS_LIST}>
                  <Link href={ROUTES.USUARIOS_LIST}>Listado</Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.Item key="logout" icon={<FileOutlined />} onClick={handleLogout}>
                  Salir
              </Menu.Item>
            </Menu>
          ) : null}
        </Sider>
        <LayoutComponent className="site-layout">
          <Header style={{ paddingRight: 40, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', color: 'white', gap: 20}}>
            <Badge count={productosStockMinimo.length} size='small'>
              <NotificationOutlined color='white' style={{color: 'white'}} onClick={() => openNotificationWithIcon('warning', productosStockMinimo)} />
            </Badge>
            <SettingOutlined />
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Usuario</Breadcrumb.Item>
              <Breadcrumb.Item>{usuario?.nombre}</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, minHeight: 360}}>
              {contextHolder}
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