import { Avatar, Button, Col, Modal, Row } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import BasicInfoForm from "./components/BasicInfo";
import "./index.scss";
import {
  CalendarOutlined,
  HomeOutlined,
  MailOutlined,
  ManOutlined,
  PhoneOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";
import HeaderSection from "../components/headerSection";
import { Gender } from "../../model/enum/common";

function Overview() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [closable, setClosable] = useState<boolean>(true);

  const { info, phoneNumber } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if(!info?.fullName) {
      setOpen(true);
      setClosable(false);
    }
  }, [])
  

  const renderGenderInfo = (gender: Gender) => {
    switch (gender) {
      case Gender.Male:
        return (
          <div style={{ fontSize: "16px", color: "#00A2FF",  }}>
            <ManOutlined style={{ fontSize: "16px", color: "#00A2FF", margin: "0 4px" }} />
            <span>Nam</span>
          </div>
        );
      case Gender.Female:
        return (
          <div style={{ fontSize: "16px", color: "#00A2FF" }}>
            <WomanOutlined style={{ fontSize: "16px", color: "#FF4785", margin: "0 4px" }} />
            <span>Nữ</span>
          </div>
        );
      default:
        return <></>;
    }
  };

  const getInfoAddress = () => {
    const list = [
      info.address,
      info.commune,
      info.district,
      info.city,
    ];

    return list.join(", ");
  };

  return (
    <div>
      <HeaderSection 
        text="Thông tin cá nhân" 
        children={
          <Button onClick={() => setOpen(true)}>Cập nhật</Button>
        }
      />
      <div>
        <Row className="personalInfo-container">
          <Col className="avatar-container">
            <Avatar shape="square" size={132} src={info.avatar} />
          </Col>
          <Col className="info-container">
            <Row className="top-info">
              <span style={{ fontSize: "20px", fontWeight: 700 }}>
                {info.fullName || "--"}
              </span>
              {renderGenderInfo(info.gender)}
            </Row>
            <Col className="bottom-info">
              <Row className="info-details">
                <CalendarOutlined />
                <span className="info-details-info">{`Ngày sinh: ${info.dateOfBirth || "--"}`}</span>
              </Row>
              <Row className="info-details">
                <PhoneOutlined />
                <span className="info-details-info">{`Số điện thoại: ${phoneNumber || "--"}`}</span>
              </Row>
              <Row className="info-details">
                <MailOutlined />
                <span className="info-details-info">{`Email: ${info?.email || "--"}`}</span>
              </Row>
              <Row className="info-details">
                <HomeOutlined />
                <span className="info-details-info">{`Địa chỉ: ${getInfoAddress() || "--"}`}</span>
              </Row>
            </Col>
          </Col>
        </Row>
      </div>
      <Modal
        centered
        width={800}
        open={isOpen}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        closable={closable}
        keyboard={false}
        maskClosable={false}
        footer={() => <></>}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Title level={4}>Cập nhật thông tin cá nhân</Title>
        </div>
        <div>
          <BasicInfoForm value={info} dismissForm={() => setOpen(false)} />
        </div>
      </Modal>
    </div>
  );
}

export default Overview;
