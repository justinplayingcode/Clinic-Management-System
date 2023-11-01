import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { mappingRouter, routerString } from '../model/router';

const breadcrumbNameMap: Record<string, string> = {
  [routerString.home]: mappingRouter[routerString.home],
  [routerString.histories]: mappingRouter[routerString.histories],
  [routerString.appointment]: mappingRouter[routerString.appointment],
  [routerString.schedule]: mappingRouter[routerString.schedule],
};

const UniformBreadcrumb = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return {
      key: url,
      title: <Link to={url}>{breadcrumbNameMap[url]}</Link>,
    };
  });

  return (
    <Breadcrumb items={extraBreadcrumbItems} style={{ height: 60, padding: 20, fontSize: 16, color: "#333"}} />
  );
};

export default UniformBreadcrumb;