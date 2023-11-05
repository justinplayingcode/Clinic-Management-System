import { Avatar, Button, Col, Input, Popconfirm, Row } from "antd";
import { AppointmentStatus, Gender, TimeFrame } from "../utils";
import {
  InfoCircleFilled,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import Text from "antd/es/typography/Text";
import "./Schedule.scss";
import { useState } from "react";
import { Role } from "../../../model/enum/auth";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux";

interface IAppointmentInfo {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  city: string;
  district: string;
  commune: string;
  address: string;

  date: string;
  timeFrame: TimeFrame;
  reason: string;
  status: AppointmentStatus;
  appointmentCode: string;
}

const appointmentList: IAppointmentInfo[] = [
  {
    id: "1",
    name: "Phạm Duy Thắng",
    dateOfBirth: "01/31/2001",
    gender: Gender.Male,
    phoneNumber: "0938273611",
    city: "Hà Nội",
    district: "Cầu Giấy",
    commune: "Nhân Chính",
    address: "",

    date: "11/05/2023",
    timeFrame: TimeFrame.Morning,
    reason: "Xoang mũi, khó thở",
    status: AppointmentStatus.Checking,
    appointmentCode: "APP000123456",
  },
  {
    id: "2",
    name: "Phạm Duy Thắng",
    dateOfBirth: "01/31/2001",
    gender: Gender.Male,
    phoneNumber: "0938273611",
    city: "Hà Nội",
    district: "Cầu Giấy",
    commune: "Nhân Chính",
    address: "",

    date: "11/05/2023",
    timeFrame: TimeFrame.Morning,
    reason: "Xoang mũi, khó thở",
    status: AppointmentStatus.CheckedAndWaitConfirm,
    appointmentCode: "APP000123456",
  },
];

function Schedule() {
  const [selectItem, setSelectItem] = useState<IAppointmentInfo>(
    appointmentList[0]
  );
  const [cancelReason, setCancelReason] = useState<string>("");

  const { role } = useSelector((state: RootState) => state.auth);

  const renderAppointmentStatus = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.Checking:
        return <>Chờ duyệt</>;
      case AppointmentStatus.CheckedAndWaitConfirm:
        return <>Đã duyệt, chờ xác nhận</>;
      case AppointmentStatus.Confirmed:
        return <>Đã xác nhận</>;
      case AppointmentStatus.Cancel:
        return <>Bị hủy</>;
      case AppointmentStatus.Complete:
        return <>Hoàn thành</>;
      default:
        return <></>;
    }
  };

  const appointmentItem = (item: IAppointmentInfo, index: number) => {
    return (
      <Row
        className={`preview-container ${selectItem.id === item.id && "active"}`}
        onClick={() => setSelectItem(item)}
      >
        <Col className="preview-avatar">
          <Avatar size="large" icon={<UserOutlined />} />
        </Col>
        <Row className="preview-info">
          <Col>
            <Row className="preview-name">
              <Text strong>{item.name}</Text>
            </Row>
            <Row className="preview-time">
              <span>{moment(item.date).format("DD/MM/YYYY")}</span>
            </Row>
            <Row className="preview-status">
              {renderAppointmentStatus(item.status)}
            </Row>
          </Col>

          {selectItem.id === item.id && (
            <RightOutlined style={{ color: "#00A2FF" }} />
          )}
        </Row>
      </Row>
    );
  };

  const renderItemTitleValue = (
    title: string | JSX.Element,
    value: string | JSX.Element
  ) => {
    return (
      <Row className="details-item">
        <Text strong>{title}</Text>
        <Text>{value}</Text>
      </Row>
    );
  };

  const renderTimeFrame = (value: TimeFrame) => {
    switch (value) {
      case TimeFrame.Morning:
        return <>7h30 - 11h30</>;
      case TimeFrame.Afternoon:
        return <>14h-16h</>;
      default:
        return <></>;
    }
  };

  const renderGenderInfo = (gender: Gender) => {
    switch (gender) {
      case Gender.Male:
        return <span>Nam</span>;
      case Gender.Female:
        return <span>Nữ</span>;
      default:
        return <></>;
    }
  };

  const getInfoAddress = (item: IAppointmentInfo) => {
    const list = [];
    if (item.address) list.push(item.address);
    list.push(item.commune, item.district, item.city);

    return list.join(", ");
  };

  const renderAppointmentDetails = (item: IAppointmentInfo) => {
    return (
      <>
        <Col className="details-container">
          <Text strong>Thông tin đặt khám</Text>

          <Col className="details-content">
            {renderItemTitleValue(
              `Ngày khám:`,
              moment(item.date).format("DD/MM/YYYY")
            )}
            {renderItemTitleValue(
              `Khung giờ khám:`,
              renderTimeFrame(item.timeFrame)
            )}
            {renderItemTitleValue(`Lý do/Triệu chứng:`, item.reason)}
            {renderItemTitleValue(
              `Trạng thái:`,
              renderAppointmentStatus(item.status)
            )}
            {renderItemTitleValue(`Mã đặt lịch:`, item.appointmentCode)}
          </Col>
        </Col>

        <Col className="details-container">
          <Text strong>Thông tin người bệnh</Text>

          <Col className="details-content">
            {renderItemTitleValue(`Họ và tên:`, item.name)}
            {renderItemTitleValue(
              `Ngày sinh:`,
              moment(item.dateOfBirth).format("DD/MM/YYYY")
            )}
            {renderItemTitleValue(`Giới tính:`, renderGenderInfo(item.gender))}
            {renderItemTitleValue(`Số điện thoại:`, item.phoneNumber)}
            {renderItemTitleValue(`Địa chỉ:`, getInfoAddress(item))}
          </Col>
        </Col>
      </>
    );
  };

  const renderButtonAcordRole = (
    role: Role | null,
    status: AppointmentStatus
  ) => {
    if (
      (status === AppointmentStatus.Checking && role === Role.admin) ||
      (status === AppointmentStatus.CheckedAndWaitConfirm &&
        role === Role.doctor)
    ) {
      return (
        <Row className="button-container">
          <Popconfirm
            title="Xác nhận lịch hẹn"
            // description="Are you sure to delete this task?"
            onConfirm={() => console.log("confirm")}
            // onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary">Xác nhận</Button>
          </Popconfirm>
          <Popconfirm
            title="Hủy lịch hẹn"
            description={
              <Col>
                <Text>Nhập lí do hủy:</Text>
                <Input
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                ></Input>
              </Col>
            }
            okButtonProps={{ disabled: !cancelReason }}
            onConfirm={() => {
              setCancelReason("");
              console.log("confirm");
            }}
            onCancel={() => setCancelReason("")}
            okText="Yes"
            cancelText="No"
          >
            <Button>Hủy</Button>
          </Popconfirm>
        </Row>
      );
    }

    return;
  };

  return (
    <>
      <Row className="appointmentList-container">
        <Col className="list-section">
          <Title level={4}>Danh sách lịch hẹn</Title>
          <Paragraph>
            Vui lòng chọn một trong các lịch hẹn có sẵn để xem chi tiết hoặc bấm
            vào <Text strong>Đặt khám mới</Text> để tạo lịch hẹn mới.
          </Paragraph>
          <Col className="list-container">
            {appointmentList.map((item, index) => appointmentItem(item, index))}
          </Col>
        </Col>
        <Col className="details-section">
          <Col className="top-details">
            <Title level={4}>Chi tiết lịch hẹn</Title>
            {renderAppointmentDetails(selectItem)}
          </Col>
          {renderButtonAcordRole(role, selectItem.status)}
          <Col className="bottom-details">
            <Row style={{ alignItems: "start", gap: "4px" }}>
              <InfoCircleFilled
                style={{ marginTop: "4px", color: "#FFA95A" }}
              />
              <Paragraph style={{ flex: 1 }}>
                Lịch khám của bạn đã được gửi đi. Vui lòng đợi{" "}
                <Text strong>Riordan Clinic</Text> xác nhận. Mọi yêu cầu về{" "}
                <Text strong>Hủy lịch/ Đổi lịch</Text> vui lòng gọi Hotline{" "}
                <Text strong>19001234</Text> để được hỗ trợ. Trân trọng cảm ơn!
              </Paragraph>
            </Row>
          </Col>
        </Col>
      </Row>
    </>
  );
}

export default Schedule;
