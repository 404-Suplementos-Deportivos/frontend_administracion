import {useState} from 'react'
import Image from 'next/image'
import Head from 'next/head'
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  NotificationOutlined,
  SettingOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Breadcrumb, Layout as LayoutComponent, Menu, theme } from 'antd'


const { Header, Content, Footer, Sider } = LayoutComponent

interface LayoutProps {
  children: React.ReactNode | JSX.Element | JSX.Element[]
  title: string
  description?: string
  desc?: string
}

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', '1', <PieChartOutlined />),
  getItem('Compras', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Ventas', 'sub2', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Productos', '2', <DesktopOutlined />),
  getItem('Usuarios', 'sub3', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Salir', '9', <FileOutlined />),
]

const desc: string = 'Panel de Admnistracion de Tienda 404 Suplementos Deportivos'

const Layout = ({children, title, description=desc}: LayoutProps) => {
  const [collapsed, setCollapsed] = useState(false)

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
            <Image src={'/404_Icono.png'} alt='Logo' width={64} height={64} style={{width: '100%', objectFit: 'contain'}} />
          </div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
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