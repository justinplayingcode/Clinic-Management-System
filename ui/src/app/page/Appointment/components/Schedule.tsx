import {
  InfoCircleFilled,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Empty, Input, Popconfirm, Row } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux";
import { Role } from "../../../model/enum/auth";
import { AppointmentStatus, Gender, TimeFrame } from "../utils";
import "./Schedule.scss";

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

// const appointmentList: IAppointmentInfo[] = [];

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
  const [selectItem, setSelectItem] = useState<IAppointmentInfo>();
  const [cancelReason, setCancelReason] = useState<string>("");

  const { role } = useSelector((state: RootState) => state.auth);

  const renderAppointmentStatus = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.Checking:
        return <Text style={{ color: "#FFDE00" }}>Chờ duyệt</Text>;
      case AppointmentStatus.CheckedAndWaitConfirm:
        return <Text style={{ color: "#EE7D21" }}>Đã duyệt, chờ xác nhận</Text>;
      case AppointmentStatus.Confirmed:
        return <Text style={{ color: "#00794E" }}>Đã xác nhận</Text>;
      case AppointmentStatus.Cancel:
        return <Text style={{ color: "#ED1C2E" }}>Bị hủy</Text>;
      case AppointmentStatus.Complete:
        return <Text style={{ color: "#005AA9" }}>Hoàn thành</Text>;
      default:
        return <></>;
    }
  };

  const appointmentItem = (item: IAppointmentInfo, index: number) => {
    return (
      <Row
        key={`preview-container-${index}`}
        className={`preview-container ${
          selectItem?.id === item.id && "active"
        }`}
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

          {selectItem?.id === item.id && (
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
    status: AppointmentStatus | undefined
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
            {appointmentList.length > 0 ? (
              appointmentList.map((item, index) => appointmentItem(item, index))
            ) : (
              <Row style={{ justifyContent: "center", marginTop: "80px" }}>
                <Col style={{ flexDirection: "column" }}>
                  <Empty
                    description={<Text>Không tìm thấy lịch hẹn nào.</Text>}
                  />
                </Col>
              </Row>
            )}
          </Col>
        </Col>
        <Col className="details-section">
          <Col className="top-details">
            <Title level={4}>Chi tiết lịch hẹn</Title>
            {!selectItem ? (
              <Row style={{ justifyContent: "center", marginTop: "80px" }}>
                <Col style={{ flexDirection: "column" }}>
                  <Empty
                    description={
                      <Text>Vui lòng chọn một lịch hẹn để xem chi tiết.</Text>
                    }
                  />
                </Col>
              </Row>
            ) : (
              renderAppointmentDetails(selectItem)
            )}
          </Col>
          {renderButtonAcordRole(role, selectItem?.status)}
          <Col className="bottom-details">
            {selectItem && (
              <Row style={{ alignItems: "start", gap: "4px" }}>
                <InfoCircleFilled
                  style={{ marginTop: "4px", color: "#FFA95A" }}
                />
                <Paragraph style={{ flex: 1 }}>
                  Lịch khám của bạn đã được gửi đi. Vui lòng đợi{" "}
                  <Text strong>Riordan Clinic</Text> xác nhận. Mọi yêu cầu về{" "}
                  <Text strong>Hủy lịch/ Đổi lịch</Text> vui lòng gọi Hotline{" "}
                  <Text strong>19001234</Text> để được hỗ trợ. Trân trọng cảm
                  ơn!
                </Paragraph>
              </Row>
            )}
          </Col>
        </Col>
      </Row>
    </>
  );
}

export default Schedule;
