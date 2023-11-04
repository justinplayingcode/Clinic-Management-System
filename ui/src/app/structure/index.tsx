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
import { closeLoading, openLoading, setInfoUser, setRole } from "../../redux/reducers";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { routerString } from "../model/router";
import { Role } from "../model/enum/auth";
import { Avatar, Dropdown } from "antd";
import { MdLogout } from "react-icons/md";
import { UserOutlined } from "@ant-design/icons";

interface IUniformLayoutProps {
  page: JSX.Element;
  permission?: Role[];
  noBackground?: boolean;
}

function UniformLayout({ ...props }: IUniformLayoutProps) {
  const { phonenumber, role } = useSelector((state: RootState) => state.auth);
  const { isLoading } = useSelector((state: RootState) => state.loading);
  const { isShow } = useSelector((state: RootState) => state.toast);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if(!localStorage.getItem('accessToken')) {
      localStorage.clear();
      navigate(`${routerString.Forbidden}`)
    }
    authApi.getInfoCurrentUser().then((result: any) => {
      if (result.status !== ApiStatus.succes) {
        localStorage.clear();
        if (result?.statusCode === ApiStatusCode.Forbidden) {
          navigate(`${routerString.Forbidden}`)
        } else if (result?.statusCode === ApiStatusCode.Unauthorized) {
          navigate(`${routerString.Unauthorized}`)
        }  else {
          navigate(`${routerString.ServerError}`)
        }
      }
      dispatch(setInfoUser(result.data))
      dispatch(setRole(result.data?.role))
    }).catch().finally(() => setLoading(false))
  }, [])

  const logOut = () => {
    localStorage.clear();
    dispatch(openLoading());
    setTimeout(() => {
      dispatch(closeLoading());
      navigate("/")
    }, 1000)
  }

  const renderContent = () => {
      const { page, permission, noBackground } = props;
      const colorList = ['#FF007F', '#1B4D3E', '#002244'];
      const userList = ['Doctor', 'User', 'Admin'];
      const items = [
        { key: 'accountinformation', label: <Link to={routerString.home}> <UserOutlined /> &nbsp; Thông tin cá nhân</Link> },
        { key: 'accountlogout', label: <div style={{ display: "flex", alignItems: "center"}} onClick={logOut}><MdLogout/> &ensp; Đăng xuất</div>},
      ]

      if(permission && permission.includes(role!)) {
        return <Navigate to={`${routerString.Unauthorized}`} replace/>
      };

      const styleMainWrapper = {
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
      }

      return (
        <div className="content">
          <div className="main-header">
            <UniformBreadcrumb/>
            <div style={{ paddingRight: "24px"}}>
              <Dropdown menu={{ items }} placement="bottomLeft" arrow>
                <Avatar style={{ backgroundColor: `${colorList[role || 0]}`, verticalAlign: 'middle', cursor: "pointer", marginTop: "8px" }} size="large">
                  {userList[role!]}
                </Avatar>
              </Dropdown>
            </div>
          </div>
          <div className="layout-wrapper">
            <div className="main-wrapper" style={noBackground ? {} : styleMainWrapper}>
              {page}
            </div>
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