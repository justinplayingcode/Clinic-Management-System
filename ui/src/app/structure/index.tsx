import { useEffect, useState } from "react";
import Avatar from "antd/es/avatar";
import UniformBreadcrumb from "./Breadcrumb";
import { LoadingDot, LoadingInComing } from "./Loading";
import Sidebar from "./Sidebar";
import "./index.scss";
import { UserOutlined } from "@ant-design/icons";
import { RootState } from "../../redux";
import { useSelector } from "react-redux";
import React from "react";
import { Toast } from "./Toast";
import { authApi } from "../../api";

interface IUniformLayoutProps {
  page: JSX.Element;
}

function UniformLayout({ ...props }: IUniformLayoutProps) {
  const { phonenumber } = useSelector((state: RootState) => state.auth);
  const { isLoading } = useSelector((state: RootState) => state.loading);
  const { isShow } = useSelector((state: RootState) => state.toast);

  
  const [loading, setLoading] = useState<boolean>(false);
  // const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    authApi.getInfoCurrentUser().then(result => {
      // if(result !== ApiStatus.succes) {
      //   localStorage.clear();
      //   dispatch(userLogout());
      // }
      console.log(result)
    }).catch().finally(() => setLoading(false))
  }, [])

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
  if(loading) {
        return <LoadingInComing/>
    } else {
        return (
          <div id="main" key={phonenumber}>
            {isLoading ? <LoadingDot /> : <React.Fragment />}
            <Sidebar />
            {renderContent()}
            {isShow && <Toast />}
          </div>
        )
    }
}

export default UniformLayout;