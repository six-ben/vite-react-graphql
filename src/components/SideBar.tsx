import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { useStore } from 'effector-react';
import styled from 'styled-components';

import { RouteOption, useRoutes } from 'src/routes';
import { appState } from 'src/store';

function renderMenuItem({ redirect, hiddenInSideBar, children, title, icon, path, query }: RouteOption, key: number) {
  if (redirect || hiddenInSideBar) return null;
  const search = new URLSearchParams(query).toString();
  if (children) {
    return (
      <Menu.SubMenu key={key} icon={icon} title={title}>
        {children.map((item, idx) => renderMenuItem(item, idx))}
      </Menu.SubMenu>
    );
  } else {
    if (!path) throw new Error('children, path must have one');
    const pathname = typeof path === 'string' ? path : path[0];
    return (
      <Menu.Item key={`${pathname}${new URLSearchParams(query)}`} icon={icon}>
        <Link to={{ pathname, search }}>{title}</Link>
      </Menu.Item>
    );
  }
}

const Sider = styled(Layout.Sider)`
  height: 100vh;
  overflow: auto;
  position: sticky;
  top: 0;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 5px;
  z-index: 11;
`;

const LogoWrap = styled.div`
  overflow: hidden;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    height: 200%;
    margin-top: -32px;
  }
`;

export default function SideBar() {
  const { routes, currentRoute } = useRoutes();
  const { sidebarCollapsed } = useStore(appState);

  // 只支持二级菜单
  const findCurrentOpendKey = () =>
    routes.findIndex(({ children }) => currentRoute && children?.includes(currentRoute));
  const currentOpendKey = findCurrentOpendKey();

  const [openKeys, setOpenKeys] = useState<number[]>([currentOpendKey]);

  useEffect(() => {
    setOpenKeys([...openKeys, currentOpendKey]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOpendKey]);

  const onOpenChange = (data: number[]) => setOpenKeys(data);
  const { path = '', query } = currentRoute || {};

  return (
    <Sider trigger={null} collapsible collapsed={sidebarCollapsed} theme="light">
      <LogoWrap>{!sidebarCollapsed && <Link to="/">logo</Link>}</LogoWrap>
      <Menu
        mode="inline"
        selectedKeys={([] as string[]).concat(path).map((p) => `${p}${new URLSearchParams(query)}`)}
        openKeys={openKeys.map((e) => String(e))}
        onOpenChange={onOpenChange}
        style={{ border: '1px solid transparent' }}
      >
        {routes.map((item, idx) => renderMenuItem(item, idx))}
      </Menu>
    </Sider>
  );
}
