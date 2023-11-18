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
  [routerString.accountdetail]: mappingRouter[routerString.accountdetail],
  [routerString.doctordetail]: mappingRouter[routerString.doctordetail],
  [routerString.managemedication]: mappingRouter[routerString.managemedication],
  [routerString.managedepartments]: mappingRouter[routerString.managedepartments],
  [routerString.manageservice]: mappingRouter[routerString.manageservice],
};

const firstMenu = [
  mappingRouter[routerString.manageaccount],
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
  const _extraBreadcrumbItems = extraBreadcrumbItems.filter(i => i.key);
  _extraBreadcrumbItems[_extraBreadcrumbItems.length - 1].title = _extraBreadcrumbItems[_extraBreadcrumbItems.length - 1].key as any;

  return (
    <Breadcrumb items={_extraBreadcrumbItems} style={{ height: 60, padding: 20, fontSize: 16 }} />
  );
};

export default UniformBreadcrumb;