import React from 'react';
import { Button, Popover, Space, Avatar, Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useStore } from 'effector-react';
import styled from 'styled-components';

import { appState, toggleSidebar } from 'src/store';
import { getColorFromChar } from 'src/common/utils';

const Header = styled(Layout.Header)`
  display: flex;
  background: white;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid #f0f0f0;
`;

export default function AppBar() {
  const { sidebarCollapsed } = useStore(appState);

  const content = (
    <div>
      <Button type="link">登出</Button>
    </div>
  );

  return (
    <Header>
      <div style={{ flexGrow: 1 }}>
        {sidebarCollapsed ? (
          <MenuUnfoldOutlined onClick={() => toggleSidebar()} />
        ) : (
          <MenuFoldOutlined onClick={() => toggleSidebar()} />
        )}
      </div>
      <Space size={16}>
        <Popover placement="bottom" content={content} trigger="hover">
          <Avatar style={{ backgroundColor: getColorFromChar('user') }}>user</Avatar>
          <span style={{ cursor: 'default', marginLeft: '10px' }}>user</span>
        </Popover>
      </Space>
    </Header>
  );
}
