import { Button, Col, Modal, Row } from "antd";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import BasicInfoForm from "../../components/BasicInfo";
import "./index.scss";
import {
  CalendarOutlined,
  HomeOutlined,
  MailOutlined,
  ManOutlined,
  PhoneOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";

const fakeInfo = {
  fullName: "Nguyễn Trọng Dự",
  gender: 0,
  dateOfBirth: "11/04/2023",
  email: "nguyentrongdupl@gmail.com",
  city: "Thành phố Hà Nội",
  district: "Quận Ba Đình",
  commune: "Phường Quán Thánh",
  address: "ưèwè",
  phoneNumber: "0979924988",
  avatar: undefined,
};

enum Gender {
  Male = 0,
  Female = 1,
}

function Overview() {
  const [isOpen, setOpen] = useState<boolean>(false);

  const { info } = useSelector((state: RootState) => state.auth);

  const renderGenderInfo = (gender: Gender) => {
    switch (gender) {
      case Gender.Male:
        return (
          <div style={{ fontSize: "16px", color: "#00A2FF" }}>
            <ManOutlined style={{ fontSize: "16px", color: "#00A2FF" }} />
            <span>Nam</span>
          </div>
        );
      case Gender.Female:
        return (
          <div style={{ fontSize: "16px", color: "#00A2FF" }}>
            <WomanOutlined style={{ fontSize: "16px", color: "#FF4785" }} />
            <span>Nữ</span>
          </div>
        );
      default:
        return <></>;
    }
  };

  const formatDOBtoDMY = (value: string) => {
    return moment(value, "MM/DD/YYYY").format("DD/MM/YYYY");
  };

  const getInfoAddress = () => {
    const list = [
      fakeInfo.address,
      fakeInfo.commune,
      fakeInfo.district,
      fakeInfo.city,
    ];

    return list.join(", ");
  };

  return (
    <div>
      Overview
      <Button onClick={() => setOpen(true)}>Click</Button>
      <div>
        <Row className="personalInfo-container">
          <Col className="avatar-container">
            <img src={fakeInfo?.avatar || info.avatar} alt="" />
          </Col>
          <Col className="info-container">
            <Row className="top-info">
              <span style={{ fontSize: "20px", fontWeight: 700 }}>
                {fakeInfo.fullName}
              </span>
              {renderGenderInfo(fakeInfo.gender)}
            </Row>
            <Col className="bottom-info">
              <Row className="info-details">
                <CalendarOutlined />
                <span>{`Ngày sinh: ${formatDOBtoDMY(
                  fakeInfo.dateOfBirth
                )}`}</span>
              </Row>
              <Row className="info-details">
                <PhoneOutlined />
                <span>{`Số điện thoại: ${fakeInfo.phoneNumber}`}</span>
              </Row>
              <Row className="info-details">
                <MailOutlined />
                <span>{`Email: ${fakeInfo?.email}`}</span>
              </Row>
              <Row className="info-details">
                <HomeOutlined />
                <span>{`Địa chỉ: ${getInfoAddress()}`}</span>
              </Row>
            </Col>
          </Col>
        </Row>
      </div>
      <Modal
        centered
        width={630}
        open={isOpen}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        closable={false}
        keyboard={false}
        maskClosable={false}
        footer={() => <></>}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Title level={4}>Thông tin cá nhân</Title>
        </div>
        <div>
          <BasicInfoForm dismissForm={() => setOpen(false)} />
        </div>
      </Modal>
    </div>
  );
}

export default Overview;
