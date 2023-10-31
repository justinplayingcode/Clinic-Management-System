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
import { HomePic1, HomePic2, Logo } from "../../../asset/images/images";
import "./index.scss";

function LandingPage() {
  const [isOpenLogin, setOpenLogin] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>("1");
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [reEnterPassWord, setReEnterPassword] = useState<string>();
  const [error, setError] = useState<string>("");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
            <div style={{ color: "red", height: "16px" }}>{error}</div>
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
                if (password !== reEnterPassWord)
                  setError("Mật khẩu không khớp");
                else setError("");
                setReEnterPassword(e.target.value);
              }}
              onBlur={() => {}}
            />
            <div style={{ color: "red", height: "16px" }}>{error}</div>
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
      return;
    }
    const body = {
      phoneNumber,
      password,
    };
    console.log("Đăng nhập", body);
  };

  const handleSignUp = () => {
    setError("");
    if (!phoneNumber || !password || !reEnterPassWord) {
      return;
    }
    if (password !== reEnterPassWord) {
      setError("Mật khẩu không khớp");
      return;
    }
    const body = {
      phoneNumber,
      password,
    };
    console.log("Đăng kí", body);
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
    <Layout className="landing-page">
      <Header
        className="header"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "fit-content",
        }}
      >
        <div className="top-header">
          <div style={{ color: "#FFFFFF" }}>
            Giờ làm việc: Thứ Hai - Thứ Sáu: 8:00 - 17:30 - Thứ Bảy: 8:00 -
            11:30
          </div>
          <div style={{ color: "#FFFFFF", display: "flex", gap: "4px" }}>
            <FacebookOutlined color="#FFFFFF" style={{ fontSize: "20px" }} />
            <GooglePlusOutlined color="#FFFFFF" style={{ fontSize: "20px" }} />
            <YoutubeOutlined color="#FFFFFF" style={{ fontSize: "20px" }} />
          </div>
        </div>
        <div className="bottom-header">
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
            <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
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
        <Modal
          centered
          width={400}
          open={isOpenLogin}
          onOk={() => setOpenLogin(false)}
          onCancel={() => setOpenLogin(false)}
          footer={onRenderFooter}
        >
          <Tabs
            defaultActiveKey="1"
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
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaas
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
                    <Button
                      type="primary"
                      onClick={() => console.warn("Đặt lịch")}
                    >
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
      <Footer style={{ textAlign: "center" }}>Clinic Project 2023</Footer>
    </Layout>
  );
}

export default LandingPage;
