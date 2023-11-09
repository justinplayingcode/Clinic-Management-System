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
import { useDispatch } from "react-redux";
import { closeLoading, openLoading, setInfoUser, setPhoneNumber, setRole } from "../../redux/reducers";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { routerString } from "../model/router";
import { Role } from "../model/enum/auth";
import { Avatar, Dropdown } from "antd";
import { MdLogout } from "react-icons/md";
import { UserOutlined } from "@ant-design/icons";
import { ApiStatusCode } from "../model/enum/apiStatus";

interface IUniformLayoutProps {
  page: JSX.Element;
  permission?: Role[];
  noBackground?: boolean;
}

function UniformLayout({ ...props }: IUniformLayoutProps) {
  const { phoneNumber, role } = useSelector((state: RootState) => state.auth);
  const { isLoading } = useSelector((state: RootState) => state.loading);
  const { isShow } = useSelector((state: RootState) => state.toast);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if(!localStorage.getItem('accessToken')) {
      localStorage.clear();
      navigate(`${routerString.Forbidden}`);
    } else {
      const auth = authApi.getCheckCurrentUser();
      const user = authApi.getInfoCurrentUser();

      Promise.all([auth, user]).then((result: any) => {
        dispatch(setPhoneNumber(result[0].data?.phoneNumber))
        dispatch(setRole(result[0].data?.role))
        dispatch(setInfoUser(result[1].data))
      }).catch(err => {
        if (err.request.status === ApiStatusCode.Forbidden) {
          localStorage.clear();
          navigate(`${routerString.Forbidden}`);
        } else if (err.request.status === ApiStatusCode.Unauthorized) {
          localStorage.clear();
          navigate(`${routerString.Unauthorized}`);
        } else {
          navigate(`${routerString.ServerError}`);
        }
      }).finally(() => setLoading(false))
    }
  }, [])

  const logOut = () => {
    dispatch(openLoading());
    setTimeout(() => {
      dispatch(closeLoading());
      localStorage.clear();
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
          <div id="main" key={phoneNumber}>
            {isLoading ? <LoadingDot /> : <React.Fragment />}
            <Sidebar />
            {renderContent()}
            {isShow && <Toast />}
          </div>
        )
    }
}

export default UniformLayout;