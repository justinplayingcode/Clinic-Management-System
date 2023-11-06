import {
  CarOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  FacebookOutlined,
  GooglePlusOutlined,
  RightOutlined,
  SnippetsOutlined,
  StarOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { Label } from "@fluentui/react";
import { Button, Input, Modal, Tabs, TabsProps, theme } from "antd";
import Layout, { Content, Footer, Header } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { HomePic2, Logo } from "../../../asset/images/images";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  openLoading,
  setRole,
  setPhoneNumber as setPhoneNumberRD,
  closeLoading,
  showToastMessage,
} from "../../../redux/reducers";
import { authApi } from "../../../api";
import { useNavigate } from "react-router-dom";
import { routerString } from "../../model/router";
import { LoadingLogin } from "../../structure/Loading";
import React from "react";
import { RootState } from "../../../redux";
import { toastType } from "../../model/enum/common";

const passwordRegex = /^[a-zA-Z0-9]{6,}$/;

function LandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector<RootState>((state) => state.loading.isLoading);

  const [isOpenLogin, setOpenLogin] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>("1");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [reEnterPassWord, setReEnterPassword] = useState<string>();
  const [error, setError] = useState<string>("");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    if(!!localStorage.getItem('accessToken')) {
      navigate(`${routerString.home}`)
    }
  }, [])

  const loginItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Đăng nhập",
      children: (
        <>
          <div className="phoneNumber">
            <Label required>Số điện thoại</Label>
            <Input
              placeholder="Hãy nhập số điện thoại"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />
          </div>
          <div className="password">
            <Label required>Mật Khẩu</Label>
            <Input.Password
              placeholder="Nhập mật khẩu"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <div
              style={{
                color: "red",
                minHeight: "16px",
                wordBreak: "break-word",
              }}
            >
              {error}
            </div>
          </div>
        </>
      ),
    },
    {
      key: "2",
      label: "Đăng kí",
      children: (
        <>
          <div className="phoneNumber">
            <Label required>Số điện thoại</Label>
            <Input
              placeholder="Hãy nhập số điện thoại"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />
          </div>
          <div className="password">
            <Label required>Mật Khẩu</Label>
            <Input.Password
              placeholder="Nhập mật khẩu"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="confirm-password">
            <Label required>Nhập lại mật Khẩu</Label>
            <Input.Password
              placeholder="Nhập lại mật khẩu"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              value={reEnterPassWord}
              onChange={(e) => {
                if (password !== e.target.value) {
                  setError("Mật khẩu không khớp");
                } else {
                  setError("");
                }
                setReEnterPassword(e.target.value);
              }}
              onBlur={() => {}}
            />
            <div
              style={{
                color: "red",
                minHeight: "16px",
                wordBreak: "break-word",
              }}
            >
              {error}
            </div>
          </div>
        </>
      ),
    },
  ];

  const handleOnchangeLoginTab = (activeKey: string) => {
    setActiveKey(activeKey);
    setPhoneNumber("");
    setPassword("");
    setReEnterPassword("");
    setError("");
  };

  useEffect(() => {
    if (isOpenLogin) setActiveKey("1");
  }, [isOpenLogin]);

  const handleLogin = () => {
    if (!phoneNumber || !password) {
      setError("Vui lòng điền các trường còn trống");
      return;
    }
    const reqbody = {
      phoneNumber,
      password,
    };
    dispatch(openLoading());
    authApi
      .login(reqbody)
      .then((data) => {
        const { accessToken } = data.data?.data;
        localStorage.setItem("accessToken", accessToken);
        navigate(`${routerString.home}`);
      })
      .catch((err) => {
        const { message } = err.response.data;
        setError(message);
      })
      .finally(() => dispatch(closeLoading()));
  };

  const handleSignUp = () => {
    setError("");
    if (!phoneNumber || !password || !reEnterPassWord) {
      setError("Vui lòng điền các trường còn trống");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError("Mật khẩu có độ dài tối thiểu 6 kí tự, chỉ bao gồm số và chữ");
      return;
    }
    if (password !== reEnterPassWord) {
      setError("Mật khẩu không khớp");
      return;
    }
    const reqbody = {
      phoneNumber,
      password,
    };
    dispatch(openLoading());
    authApi
      .register(reqbody)
      .then((data) => {
        const { accessToken, role, phoneNumber } = data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("phoneNumber", phoneNumber);
        dispatch(setRole(role));
        dispatch(setPhoneNumberRD(phoneNumber));
        dispatch(
          showToastMessage({
            message: "Tạo tài khoản thành công",
            type: toastType.succes,
          })
        );
        navigate(`${routerString.home}`);
      })
      .catch((err) => {
        const { message } = err.response.data;
        setError(message);
      })
      .finally(() => dispatch(closeLoading()));
  };

  const onRenderFooter = () => {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
        }}
      >
        {activeKey === "1" ? (
          <Button
            style={{ width: "100%" }}
            type="primary"
            onClick={handleLogin}
          >
            Đăng nhập
          </Button>
        ) : (
          <Button
            style={{ width: "100%" }}
            type="primary"
            onClick={handleSignUp}
          >
            Đăng kí
          </Button>
        )}
      </div>
    );
  };

  return (
    <>
      {loading ? <LoadingLogin /> : <React.Fragment />}
      <Layout className="landing-page">
        <Header className="header">
          <div className="top-header">
            <div className="header-container">
              <div style={{ color: "#FFFFFF" }}>
                Giờ làm việc: Thứ Hai - Thứ Sáu: 8:00 - 17:30 - Thứ Bảy: 8:00 -
                11:30
              </div>
              <div style={{ color: "#FFFFFF", display: "flex", gap: "4px" }}>
                <FacebookOutlined
                  color="#FFFFFF"
                  style={{ fontSize: "20px" }}
                />
                <GooglePlusOutlined
                  color="#FFFFFF"
                  style={{ fontSize: "20px" }}
                />
                <YoutubeOutlined color="#FFFFFF" style={{ fontSize: "20px" }} />
              </div>
            </div>
          </div>
          <div className="bottom-header">
            <div className="header-container">
              <img
                alt=""
                src={Logo}
                style={{
                  width: "100px",
                  height: "48px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: "45px",
                }}
              >
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "30px" }}
                >
                  <div>Trang chủ</div>
                  <div>Về chúng tôi</div>
                  <div>Dịch vụ</div>
                  <div>Đội ngũ</div>
                  <div>Liên hệ</div>
                </div>
                <Button type="primary" ghost onClick={() => setOpenLogin(true)}>
                  Đăng nhập
                </Button>
              </div>
            </div>
          </div>
          <Modal
            centered
            width={400}
            open={isOpenLogin}
            onOk={() => setOpenLogin(false)}
            onCancel={() => setOpenLogin(false)}
            footer={onRenderFooter}
          >
            <Tabs
              activeKey={activeKey}
              items={loginItems}
              onChange={(activeKey) => handleOnchangeLoginTab(activeKey)}
            />
          </Modal>
        </Header>
        <Content className="site-layout content">
          <div className="content-section-1">
            <div className="main-title">
              <div
                style={{
                  fontSize: "60px",
                  fontWeight: 700,
                  color: "#0B395C",
                }}
              >
                Chẩn đoán chính xác
              </div>
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: 400,
                  color: "#0B395C",
                  marginBottom: "40px",
                }}
              >
                Trong từng ca khám
              </div>
              <div
                style={{
                  width: "230px",
                  height: "43px",
                  backgroundColor: "#0067A2",
                  color: "#FFFFFF",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "4px 16px",
                  borderRadius: "4px",
                  marginBottom: "80px",
                }}
              >
                <div>Xem thêm</div>
                <RightOutlined />
              </div>
            </div>
            <div className="menus">
              <div className="menu">
                <div style={{ display: "flex", gap: "8px" }}>
                  <SnippetsOutlined style={{ fontSize: "40px" }} />
                  <div>
                    <div>Đầy đủ</div>
                    <div>thiết bị</div>
                  </div>
                </div>
              </div>
              <div className="menu">
                <div style={{ display: "flex", gap: "8px" }}>
                  <DollarOutlined style={{ fontSize: "40px" }} />
                  <div>
                    <div> Giá cả</div>
                    <div>phù hợp</div>
                  </div>
                </div>
              </div>
              <div className="menu">
                <div style={{ display: "flex", gap: "8px" }}>
                  <StarOutlined style={{ fontSize: "40px" }} />
                  <div>
                    <div>Tiêu chuẩn </div>
                    <div>ISO|FDA</div>
                  </div>
                </div>
              </div>
              <div className="menu">
                <div style={{ display: "flex", gap: "8px" }}>
                  <CarOutlined style={{ fontSize: "40px" }} />
                  <div>
                    <div>Đưa đón </div>
                    <div>tận nhà</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="content-section-2"
            style={{ minHeight: 380, background: colorBgContainer }}
          >
            <div className="section-2-title">
              <div
                style={{ color: "#0B395C", fontSize: "40px", fontWeight: 600 }}
              >
                Đội ngũ chất lượng
              </div>
              <div
                style={{ color: "#0B395C", fontSize: "40px", fontWeight: 600 }}
              >
                Luôn sẵn sàng tiếp đón!
              </div>
            </div>
            <div className="section-2-content">
              <div
                className="content-desctiption"
                style={{
                  padding: "30px",
                }}
              >
                <div style={{ marginBottom: "40px", wordBreak: "break-word" }}>
                  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaas
                </div>
                <div className="content-appointment">
                  <div className="appointment">
                    <div className="appointment-top">
                      <div className="top-certificate">
                        <CheckCircleOutlined /> Hơn 20 năm kinh nghiệm
                      </div>
                      <div className="top-certificate">
                        <CheckCircleOutlined /> Hơn 20 năm kinh nghiệm
                      </div>
                      <div className="top-certificate">
                        <CheckCircleOutlined /> Hơn 20 năm kinh nghiệm
                      </div>
                      <div className="top-certificate">
                        <CheckCircleOutlined /> Hơn 20 năm kinh nghiệm
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                      }}
                    >
                      <Button type="primary" onClick={() => setOpenLogin(true)}>
                        Đặt lịch khám bệnh
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-image">
                <img src={HomePic2} alt="" />
              </div>
            </div>
          </div>
        </Content>
        <Footer className="footer">Clinic Project 2023</Footer>
      </Layout>
    </>
  );
}

export default LandingPage;
