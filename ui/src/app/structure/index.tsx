// import { useState } from "react";
import Avatar from "antd/es/avatar";
import UniformBreadcrumb from "./Breadcrumb";
import { LoadingLogin } from "./Loading";
import Sidebar from "./Sidebar";
import "./index.scss";
import { UserOutlined } from "@ant-design/icons";

interface IUniformLayoutProps {
  page: JSX.Element;
}

function UniformLayout({ ...props }: IUniformLayoutProps) {
  // const [loading, setLoading] = useState<boolean>(true);


  const renderContent = () => {
      const { page } = props;
      return (
        <div className="content">
          <div className="main-header">
            <UniformBreadcrumb/>
            <Avatar size={40} icon={<UserOutlined />} />
          </div>
          <div className="layout-wrapper">
            {page}
          </div>
        </div>
      )
  }
  if(false) {
        return <LoadingLogin/>
    } else {
        return (
          <div id="main">
            <Sidebar />
            {renderContent()}
          </div>
        )
    }
}

export default UniformLayout;