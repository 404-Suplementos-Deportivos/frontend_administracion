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
  USUARIOS = '/usuarios',
  LOGOUT = '/logout'
}

const Layout = ({children, title, description=desc}: LayoutProps) => {
  const [collapsed, setCollapsed] = useState<LayoutState['collapsed']>(false)
  const router = useRouter()
  const [selectedKey, setSelectedKey] = useState<LayoutState['selectedKey']>('');

  const { pathname } = router

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
                <Menu.Item key="1">Tom</Menu.Item>
                <Menu.Item key="2">Bill</Menu.Item>
                <Menu.Item key="3">Alex</Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key="ventas" icon={<UserOutlined />} title="Ventas">
                <Menu.Item key="5">Tom</Menu.Item>
                <Menu.Item key="6">Bill</Menu.Item>
                <Menu.Item key="7">Alex</Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key={ROUTES.PRODUCTOS} icon={<DesktopOutlined />} title="Productos">
                <Menu.Item key={ROUTES.PRODUCTOS_LIST}>
                  <Link href={ROUTES.PRODUCTOS_LIST}>Listado</Link>
                </Menu.Item>
                <Menu.Item key={ROUTES.PRODUCTOS_CREATE}>
                  <Link href={ROUTES.PRODUCTOS_CREATE}>Nuevo Producto</Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key="usuarios" icon={<TeamOutlined />} title="Usuarios">
                <Menu.Item key="11">Team 1</Menu.Item>
                <Menu.Item key="12">Team 2</Menu.Item>
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