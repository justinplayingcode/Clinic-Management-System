import {
  CheckCircleOutlined,
  InfoCircleFilled,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Empty,
  Input,
  Modal,
  Popconfirm,
  Row,
  Steps,
  message,
  theme,
} from "antd";
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
import DetailsInfo from "../../components/DetailsInfo";
import { PositionOfDoctor, RankOfDoctor } from "../../../model/enum/common";
import { Utils } from "../../../../utils";
import { departmentApi } from "../../../../api";
import UniformTable from "../../components/table";
import { AxiosResponse } from "axios";
import { tooltipPlainText } from "../../../../utils/basicRender";
import { ICommandBarItemProps } from "@fluentui/react";

interface ISelectOption {
  value: string;
  label: string;
}
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

  doctor?: {
    id: string;
    name: string;
    departmentName: string;
    position: PositionOfDoctor;
    rank: RankOfDoctor;
    phoneNumber: string;
  };
}

const columns = [
  {
    key: "name",
    name: "Họ và tên",
    minWidth: 80,
    maxWidth: 180,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.fullName)}</span>;
    },
  },
  {
    key: "rank",
    name: "Học vấn",
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{Utils.getDoctorRankText(item.rank)}</span>;
    },
  },
  {
    key: "position",
    name: "Vai trò",
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{Utils.getDoctorPositionText(item.position)}</span>;
    },
  },
  {
    key: "phoneNumber",
    name: "Số điện thoại",
    minWidth: 80,
    maxWidth: 150,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.phoneNumber)}</span>;
    },
  },
  {
    key: "email",
    name: "Email",
    minWidth: 100,
    maxWidth: 160,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.email)}</span>;
    },
  },
  {
    key: "gender",
    name: "Giới tính",
    minWidth: 80,
    maxWidth: 150,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{Utils.getGenderText(item.gender)}</span>;
    },
  },
  {
    key: "dob",
    name: "Ngày sinh",
    minWidth: 80,
    maxWidth: 150,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.dateOfBirth)}</span>;
    },
  },
  {
    key: "address",
    name: "Địa chỉ",
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.address)}</span>;
    },
  },
];

// const appointmentList: IAppointmentInfo[] = [];

const listData: IAppointmentInfo[] = [
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

    // doctor: {
    //   id: "doctor1",
    //   name: "Name 1",
    //   departmentName: "Khoa Nội",
    //   position: PositionOfDoctor.viceDean,
    //   rank: RankOfDoctor.GSTS,
    //   phoneNumber: "0123456789",
    // },
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

    doctor: {
      id: "doctor2",
      name: "Name 2",
      departmentName: "Khoa Nội",
      position: PositionOfDoctor.viceDean,
      rank: RankOfDoctor.GSTS,
      phoneNumber: "0123456789",
    },
  },
];

function Schedule() {
  const [departmentList, setDepartmentList] = useState<ISelectOption[]>([]);
  const [isOpenSelectDoctor, setOpenSelectDoctor] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<IAppointmentInfo>();
  const [cancelReason, setCancelReason] = useState<string>("");
  const { tableSelectedCount, tableSelectedItem } = useSelector(
    (state: RootState) => state.currentSeleted
  );
  const [appointmentList, setAppointmentList] =
    useState<IAppointmentInfo[]>(listData);

  const { role } = useSelector((state: RootState) => state.auth);

  const callApiDepartment = () => {
    return departmentApi.getDepartmentList().then((response) => {
      const result = response?.data?.map((item: any) => {
        return {
          value: item?._id,
          label: item?.displayName,
        };
      });
      setDepartmentList(result);
    });
  };

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
        {selectItem?.doctor?.id && (
          <DetailsInfo
            title="Thông tin bác sĩ"
            items={[
              {
                label: "Họ và tên",
                value: selectItem?.doctor.name,
              },
              {
                label: "Khoa",
                value: selectItem?.doctor.departmentName,
              },
              {
                label: "Chức vụ",
                value: Utils.getDoctorPositionText(selectItem?.doctor.position),
              },
              {
                label: "Học vấn",
                value: Utils.getDoctorRankText(selectItem?.doctor.rank),
              },
              {
                label: "Số điện thoại",
                value: selectItem?.doctor.phoneNumber,
              },
            ]}
          />
        )}
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
            onConfirm={() => console.log("confirm")}
            okText="Yes"
            cancelText="No"
          >
            <Button disabled={!selectItem?.doctor?.id} type="primary">
              Xác nhận
            </Button>
          </Popconfirm>
          {/* {!selectItem?.doctor && ( */}
          <Button
            onClick={() => {
              setOpenSelectDoctor(true);
              callApiDepartment();
            }}
          >
            Chọn bác sĩ
          </Button>
          {/* )} */}
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

  const renderScheduleStepper = () => {
    const defaultSelectOption: ISelectOption = {
      value: "",
      label: "",
    };
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [selectDepartment, setSelectDepartment] =
      useState<ISelectOption>(defaultSelectOption);
    const [selectDoctor, setSelectDoctor] = useState<string>("");

    const contentStyle: React.CSSProperties = {
      lineHeight: "260px",
      textAlign: "center",
      color: token.colorTextTertiary,
      backgroundColor: token.colorFillAlter,
      borderRadius: token.borderRadiusLG,
      border: `1px dashed ${token.colorBorder}`,
      marginTop: 16,
    };

    const renderStepperFooter = () => {
      return <></>;
    };

    const next = () => {
      setCurrent(current + 1);
    };

    const prev = () => {
      setCurrent(current - 1);
    };

    const handleCancel = () => {
      setCurrent(0);
      setSelectDepartment(defaultSelectOption);
      setSelectDoctor("");
      setOpenSelectDoctor(false);
    };

    const handleOk = () => {
      setSelectItem({
        ...selectItem,
        doctor: {
          id: tableSelectedItem[0].doctorId,
          name: tableSelectedItem[0].fullName,
          departmentName: tableSelectedItem[0].departmentName,
          position: PositionOfDoctor.dean,
          rank: RankOfDoctor.tienSi,
          phoneNumber: tableSelectedItem[0].phoneNumber,
        },
      } as IAppointmentInfo);

      setCurrent(0);
      setSelectDepartment(defaultSelectOption);
      setSelectDoctor("");
      setOpenSelectDoctor(false);
    };

    const departmentItem = (item: ISelectOption, _: number) => {
      return (
        <Row
          className={`preview-container ${
            selectDepartment?.value === item.value && "active"
          }`}
          onClick={() => {
            setSelectDepartment(item);
          }}
        >
          <Col className="preview-avatar">
            {/* <Avatar size="large" icon={<UserOutlined />} /> */}
          </Col>
          <Row className="preview-info">
            <Col>
              <Row className="preview-name">
                <Text strong>{item.label}</Text>
              </Row>
            </Col>

            {selectDepartment?.value === item.value && (
              <CheckCircleOutlined
                style={{ fontSize: "20px", color: "#00AB1C" }}
              />
            )}
          </Row>
        </Row>
      );
    };

    const integrateItems = (reqbody: any): Promise<AxiosResponse<any, any>> => {
      const body = {
        ...reqbody,
        id: selectDepartment?.value,
      };
      return departmentApi.manageDepartment(body);
    };

    const stepperItem = [
      {
        title: "Chọn Khoa",
        content: (
          <>
            <Col className="list-container">
              {departmentList.length > 0 ? (
                departmentList.map((item, index) => departmentItem(item, index))
              ) : (
                <Row style={{ justifyContent: "center", marginTop: "80px" }}>
                  <Col style={{ flexDirection: "column" }}>
                    <Empty />
                  </Col>
                </Row>
              )}
            </Col>
          </>
        ),
      },
      {
        title: "Chọn bác sĩ",
        content: (
          <div>
            <UniformTable
              key={JSON.stringify(selectDepartment?.value)}
              columns={columns}
              commandBarItems={[]}
              integrateItems={integrateItems}
              searchByColumn={"fullName"}
              searchPlaceholder={"tên"}
            />
          </div>
        ),
      },
    ];

    return (
      <Modal
        title="Chỉ định bác sĩ"
        footer={renderStepperFooter}
        open={isOpenSelectDoctor}
        onOk={handleOk}
        onCancel={handleCancel}
        width={900}
      >
        <Steps current={current} items={stepperItem} />
        <div className="selectDoctor-modal" style={contentStyle}>
          {stepperItem[current].content}
        </div>
        <div style={{ marginTop: 24 }}>
          {current < stepperItem.length - 1 && (
            <Button
              type="primary"
              disabled={selectDepartment.value === defaultSelectOption.value}
              onClick={() => next()}
            >
              Sau
            </Button>
          )}
          {current === stepperItem.length - 1 && (
            <Button
              type="primary"
              disabled={tableSelectedCount !== 1}
              onClick={() => {
                handleOk();
              }}
            >
              Hoàn thành
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
              Trước
            </Button>
          )}
        </div>
      </Modal>
    );
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
        <Col
          className="details-section"
          style={{ height: !selectItem ? "100%" : "" }}
        >
          <Col
            className="top-details"
            style={{ height: !selectItem ? "100%" : "" }}
          >
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
        {renderScheduleStepper()}
      </Row>
    </>
  );
}

export default Schedule;
