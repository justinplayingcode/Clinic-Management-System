import React, { useEffect, useState } from 'react';
import { HomeOutlined, FileSearchOutlined, MedicineBoxOutlined, CalendarOutlined, TeamOutlined, ApartmentOutlined, ScheduleOutlined, PlusSquareOutlined, SolutionOutlined } from '@ant-design/icons';
import { FaUserDoctor } from "react-icons/fa6";
import { MdOutlineMedication, MdOutlineMedicalServices } from "react-icons/md";
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { mappingRouter, routerString } from '../model/router';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogoSidebar } from '../../asset/images/images';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { Role } from '../model/enum/auth';

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

const items = (role: Role): MenuItem[] => {
  switch(role) {
    case Role.admin:
      return [
        getItem(mappingRouter[routerString.home], `${routerString.home}`, <HomeOutlined />),
        getItem(mappingRouter[routerString.manageaccount], `${routerString.manageaccount}`, <SolutionOutlined />, [
          getItem(mappingRouter[routerString.manageaccountdoctor], `${routerString.manageaccountdoctor}`, <FaUserDoctor/>),
          getItem(mappingRouter[routerString.manageaccountuser], `${routerString.manageaccountuser}`, <TeamOutlined />),
        ]),
        getItem("Quản lý lịch hẹn", `${routerString.schedule}`, <ScheduleOutlined />),
        getItem(mappingRouter[routerString.histories], `${routerString.histories}`, <FileSearchOutlined />),
        getItem("Khoa", `${routerString.managedepartments}`, <ApartmentOutlined/>),
        getItem("Dịch vụ", `${routerString.manageservice}`, <MdOutlineMedicalServices />),
        getItem("Thuốc", `${routerString.managemedication}`, <MdOutlineMedication />),
      ]
    case Role.doctor:
      return [
        getItem(mappingRouter[routerString.home], `${routerString.home}`, <HomeOutlined />),
        getItem("Quản lý lịch hẹn", `${routerString.schedule}`, <ScheduleOutlined />),
        getItem(mappingRouter[routerString.histories], `${routerString.histories}`, <FileSearchOutlined />),
        getItem("Khoa", `${routerString.managedepartments}`, <ApartmentOutlined/>),
        getItem("Dịch vụ", `${routerString.manageservice}`, <MdOutlineMedicalServices />),
        getItem(mappingRouter[routerString.managemedication], `${routerString.managemedication}`, <PlusSquareOutlined />),
      ]
    default:
      return [
        getItem(mappingRouter[routerString.home], `${routerString.home}`, <HomeOutlined />),
        getItem(mappingRouter[routerString.schedule], `${routerString.schedule}`, <CalendarOutlined />),
        getItem("Đặt lịch khám bệnh", `${routerString.appointment}`, <MedicineBoxOutlined />),
        getItem(mappingRouter[routerString.histories], `${routerString.histories}`, <FileSearchOutlined />),
        getItem("Khoa", `${routerString.managedepartments}`, <ApartmentOutlined/>),
        getItem("Dịch vụ", `${routerString.manageservice}`, <MdOutlineMedicalServices />),
        getItem(mappingRouter[routerString.managemedication], `${routerString.managemedication}`, <PlusSquareOutlined />),
      ]
  }
}

const sideBarKeys = [
  routerString.home,
  routerString.histories,
  routerString.appointment,
  routerString.schedule,
  routerString.manageaccountdoctor,
  routerString.manageaccountuser,
  routerString.managedepartments,
  routerString.managemedication,
  routerString.manageservice
]


const Sidebar: React.FC = () => {
  const { role } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const arrpath = location.pathname.split('/').filter((i) => i);
  const [current, setCurrent] = useState<string>(location.pathname);
  
  useEffect(() => {
    setCurrent(location.pathname);
  }, [location.pathname])

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    navigate(e.key);
  };

  const getSelectedKey = (currentPath: string): string[] => {
    const arr = currentPath.split("/");
    let key = arr.join("/");
    let currentItem = sideBarKeys.includes(key);
    while(!currentItem) {
      arr.pop();
      key = arr.join("/");
      currentItem = sideBarKeys.includes(key);
    }
    return [key]
  }

  return (
    <div id="main-sidebar" key={location.pathname}>
      <div className='sidebar-top'>
        <div style={{ height: "60px", backgroundColor: "#001529", color: "#333", display: "flex", alignItems: "end", paddingLeft: "32px"}}>
          <img alt="" src={LogoSidebar} style={{ width: "100px", height: "44px" }} />
        </div>
        <Menu
          key={role}
          theme={'dark'}
          onClick={onClick}
          style={{ width: 240, height: "calc(100% - 60px)" }}
          defaultOpenKeys={[`/${arrpath[0]}`]}
          selectedKeys={getSelectedKey(current)}
          mode="inline"
          items={items(role!)}
          className='sidebar-menu'
        />
      </div>
    </div>
  );
};

export default Sidebar;