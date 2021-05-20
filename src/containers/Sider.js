import {useState} from "react";
import {Link} from "react-router-dom";

import {Layout, Menu} from 'antd';
import {EnvironmentOutlined, SettingOutlined, ShopOutlined, UserOutlined, HomeOutlined} from "@ant-design/icons";

const {Sider} = Layout;

export default function LayoutSider() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div className="logo"/>
            <Menu theme="dark" mode="inline">
                <Menu.Item key="0" icon={<HomeOutlined/>}>
                    <Link to={'/'}>Home</Link>
                </Menu.Item>
                <Menu.Item key="1" icon={<SettingOutlined/>}>
                    <Link to={'/ativos'}>Ativos</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<ShopOutlined/>}>
                    <Link to={'/empresas'}>Empresas</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<EnvironmentOutlined/>}>
                    <Link to={'/unidades'}>Unidades</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<UserOutlined/>}>
                    <Link to={'/usuarios'}>Usuários</Link>
                </Menu.Item>
            </Menu>
        </Sider>);
}