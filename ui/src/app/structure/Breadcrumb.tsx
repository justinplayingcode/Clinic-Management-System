import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { mappingRouter, routerString } from '../model/router';

const breadcrumbNameMap: Record<string, string> = {
  [routerString.home]: mappingRouter[routerString.home],
  [routerString.histories]: mappingRouter[routerString.histories],
  [routerString.appointment]: mappingRouter[routerString.appointment],
  [routerString.schedule]: mappingRouter[routerString.schedule],
  [routerString.manageaccount]: mappingRouter[routerString.manageaccount],
  [routerString.manageaccountdoctor]: mappingRouter[routerString.manageaccountdoctor],
  [routerString.manageaccountuser]: mappingRouter[routerString.manageaccountuser],
  [routerString.managemedication]: mappingRouter[routerString.managemedication],
  [routerString.managedepartment]: mappingRouter[routerString.managedepartment],
};

const firstMenu = [
  mappingRouter[routerString.manageaccount]
]

const UniformBreadcrumb = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    let _title = <Link to={url}>{breadcrumbNameMap[url]}</Link>;
    if (firstMenu.includes(breadcrumbNameMap[url]) || location.pathname === url) {
      _title = <>{breadcrumbNameMap[url]}</>
    }
    return {
      key: breadcrumbNameMap[url],
      title: _title,
    };
  });

  return (
    <Breadcrumb items={extraBreadcrumbItems} style={{ height: 60, padding: 20, fontSize: 16, color: "#333" }} />
  );
};

export default UniformBreadcrumb;