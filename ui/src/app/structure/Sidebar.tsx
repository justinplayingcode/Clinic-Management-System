import React, { useEffect, useState } from 'react';
import { HomeOutlined, FileSearchOutlined, MedicineBoxOutlined, CalendarOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { mappingRouter, routerString } from '../model/router';
import { useLocation, useNavigate } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
    getItem(mappingRouter[routerString.home], `${routerString.home}`, <HomeOutlined />),
    getItem(mappingRouter[routerString.schedule], `${routerString.schedule}`, <CalendarOutlined />),
    getItem(mappingRouter[routerString.appointment], `${routerString.appointment}`, <MedicineBoxOutlined />),
    getItem(mappingRouter[routerString.histories], `${routerString.histories}`, <FileSearchOutlined />),
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [current, setCurrent] = useState<string>(location.pathname);

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location.pathname])

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    navigate(e.key);
  };

  return (
    <div id="main-sidebar" key={location.pathname}>
      <div style={{ height: "60px", backgroundColor: "#fff", color: "#333"}}>
        icon
      </div>
      <Menu
        theme={'light'}
        onClick={onClick}
        style={{ width: 240, height: "calc(100% - 60px)" }}
        defaultOpenKeys={['sub1']}
        selectedKeys={[current]}
        mode="inline"
        items={items}
      />
    </div>
  );
};

export default Sidebar;