import { useEffect, useState } from "react";
import UniformBreadcrumb from "./Breadcrumb";
import { LoadingDot, LoadingInComing } from "./Loading";
import Sidebar from "./Sidebar";
import "./index.scss";
import { RootState } from "../../redux";
import { useSelector } from "react-redux";
import React from "react";
import { Toast } from "./Toast";
import { authApi } from "../../api";
import { ApiStatus, ApiStatusCode } from "../model/enum/apiStatus";
import { useDispatch } from "react-redux";
import { setInfoUser } from "../../redux/reducers";

interface IUniformLayoutProps {
  page: JSX.Element;
}

function UniformLayout({ ...props }: IUniformLayoutProps) {
  const { phonenumber } = useSelector((state: RootState) => state.auth);
  const { isLoading } = useSelector((state: RootState) => state.loading);
  const { isShow } = useSelector((state: RootState) => state.toast);

  const dispatch = useDispatch();

  
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    authApi.getInfoCurrentUser().then((result: any) => {
      if (result.status !== ApiStatus.succes) {
        localStorage.clear();
        if (result?.statusCode === ApiStatusCode.Forbidden || result?.statusCode === ApiStatusCode.Unauthorized) {
          // redirect to expired page
        } else if (result?.statusCode === ApiStatusCode.ServerError) {
          // redirect to 500 page
        } else {
          // redirect to 404 page
        }
      }
      dispatch(setInfoUser(result.data))
    }).catch().finally(() => setLoading(false))
  }, [])

  const renderContent = () => {
      const { page } = props;
      return (
        <div className="content">
          <div className="main-header">
            <UniformBreadcrumb/>
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