import {
  CheckCircleOutlined,
  InfoCircleFilled,
  RightOutlined,
  UndoOutlined,
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
  theme,
} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux";
import { Role } from "../../../model/enum/auth";
import "./Schedule.scss";
import DetailsInfo from "../../components/DetailsInfo";
import {
  AppointmentStatus,
  Gender,
  PositionOfDoctor,
  RankOfDoctor,
  TimeFrame,
} from "../../../model/enum/common";
import { Utils } from "../../../../utils";
import { departmentApi, scheduleApi } from "../../../../api";
import UniformTable from "../../components/table";
import { AxiosResponse } from "axios";
import {
  renderAppointmentStatus,
  tooltipPlainText,
} from "../../../../utils/basicRender";

interface ISelectOption {
  value: string;
  label: string;
}
interface IAppointmentInfo {
  _id: string;
  patientId: string;
  accountId: string;
  appointmentDate: string;
  appointmentTime: TimeFrame;
  appointmentReason: string;
  status: AppointmentStatus;
  typeAppointmentId: string;
  departmentId: string;
  doctorId: string;
  doctor: {
    rank: RankOfDoctor;
    position: PositionOfDoctor;
    departmentName: string;
    departmentId: string;
    accountId: string;
    userId: string;
    email: string;
    avatar: string;
    fullName: string;
    gender: Gender;
    address: string;
    dateOfBirth: string;
    phoneNumber: string;
  };

  patient: {
    fullName: string;
    dateOfBirth: string;
    address: string;
    phoneNumber: string;
    insurance: string;
    gender: string;
    guardianName: string;
    guardianPhoneNumber: string;
    guardianRelationship: string;
  };
}

const columns = [
  {
    key: "name",
    name: "Họ và tên",
    minWidth: 100,
    maxWidth: 150,
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
    minWidth: 80,
    maxWidth: 160,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.email)}</span>;
    },
  },
];

function Schedule() {
  const [departmentList, setDepartmentList] = useState<ISelectOption[]>([]);
  const [isOpenSelectDoctor, setOpenSelectDoctor] = useState<boolean>(false);
  const [isOpenProcess, setOpenProcess] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<IAppointmentInfo>();
  const [cancelReason, setCancelReason] = useState<string>("");
  const { tableSelectedCount, tableSelectedItem } = useSelector(
    (state: RootState) => state.currentSeleted
  );
  const [appointmentList, setAppointmentList] = useState<IAppointmentInfo[]>(
    []
  );

  const { role } = useSelector((state: RootState) => state.auth);

  const callScheduleList = () => {
    return scheduleApi.getAll().then((response) => {
      const result = response?.data;
      setAppointmentList(result);
    });
  };

  useEffect(() => {
    callScheduleList();
  }, []);

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

  const appointmentItem = (item: IAppointmentInfo, index: number) => {
    return (
      <Row
        key={`preview-container-${index}`}
        className={`preview-container ${
          selectItem?._id === item._id && "active"
        }`}
        onClick={() => setSelectItem(item)}
      >
        <Col className="preview-avatar">
          <Avatar size="large" icon={<UserOutlined />} />
        </Col>
        <Row className="preview-info">
          <Col>
            <Row className="preview-name">
              <Text strong>{item.patient.fullName}</Text>
            </Row>
            <Row className="preview-time">
              <span>{item.patient.dateOfBirth}</span>
            </Row>
            <Row className="preview-status">
              {renderAppointmentStatus(item.status)}
            </Row>
          </Col>
          {selectItem?._id === item._id && (
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
    if (item.patient.address) list.push(item.patient.address);
    // list.push(item.commune, item.district, item.city);

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
              moment(item.appointmentDate).format("DD/MM/YYYY")
            )}
            {renderItemTitleValue(
              `Khung giờ khám:`,
              renderTimeFrame(item.appointmentTime)
            )}
            {renderItemTitleValue(`Lý do/Triệu chứng:`, item.appointmentReason)}
            {renderItemTitleValue(
              `Trạng thái:`,
              renderAppointmentStatus(item.status)
            )}
            {/* {renderItemTitleValue(`Mã đặt lịch:`, item.appointmentCode)} */}
          </Col>
        </Col>

        <Col className="details-container">
          <Text strong>Thông tin người bệnh</Text>

          <Col className="details-content">
            {renderItemTitleValue(`Họ và tên:`, item.patient.fullName)}
            {renderItemTitleValue(`Ngày sinh:`, item.patient.dateOfBirth)}
            {renderItemTitleValue(
              `Giới tính:`,
              renderGenderInfo(Number(item.patient.gender))
            )}
            {renderItemTitleValue(`Số điện thoại:`, item.patient.phoneNumber)}
            {renderItemTitleValue(`Địa chỉ:`, getInfoAddress(item))}
          </Col>
        </Col>
        {selectItem?.doctorId && (
          <DetailsInfo
            title="Thông tin bác sĩ"
            items={[
              {
                label: "Họ và tên",
                value: selectItem?.doctor.fullName,
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

  const handleAdminVerifyDeny = (isAccept: boolean, cancelReason?: string) => {
    console.log({
      id: selectItem?._id ?? "",
      doctorId: selectItem?.doctorId ?? "",
      departmentId: selectItem?.doctor.departmentId ?? "",
      isAccept: isAccept,
      cancellationReason: cancelReason ?? "",
    });
  };

  const renderButtonAcordRole = (
    role: Role | null,
    status: AppointmentStatus | undefined
  ) => {
    return (
      <Row className="button-container">
        {((status === AppointmentStatus.Checking && role === Role.admin) ||
          (status === AppointmentStatus.CheckedAndWaitConfirm &&
            role === Role.doctor)) && (
          <>
            <Popconfirm
              title="Xác nhận lịch hẹn"
              onConfirm={() => {
                handleAdminVerifyDeny(true);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button disabled={!selectItem?.doctorId} type="primary">
                Xác nhận
              </Button>
            </Popconfirm>
            {status === AppointmentStatus.Checking && role === Role.admin && (
              <Button
                onClick={() => {
                  setOpenSelectDoctor(true);
                  callApiDepartment();
                }}
              >
                Chọn bác sĩ
              </Button>
            )}
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
                handleAdminVerifyDeny(false, cancelReason);
                setCancelReason("");
              }}
              onCancel={() => setCancelReason("")}
              okText="Yes"
              cancelText="No"
            >
              <Button>Hủy</Button>
            </Popconfirm>
          </>
        )}
        {status === AppointmentStatus.Confirmed && role === Role.doctor && (
          <Button
            disabled={
              selectItem?.appointmentDate !==
              moment(new Date()).format("MM/DD/YYYY").toString()
            }
            onClick={() => {
              setOpenProcess(true);
            }}
          >
            Bắt đầu khám
          </Button>
        )}
      </Row>
    );
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
      // setSelectDoctor("");
      setOpenSelectDoctor(false);
    };

    const handleOk = () => {
      // setSelectDoctor({
      //   doctorId: tableSelectedItem[0].doctorId,
      //   departmentId: selectDepartment?.value,
      // });
      setSelectItem({
        ...selectItem,
        doctorId: tableSelectedItem[0].doctorId,
        doctor: {
          rank: tableSelectedItem[0].rank,
          position: tableSelectedItem[0].position,
          departmentName: tableSelectedItem[0].departmentName,
          departmentId: selectDepartment?.value,
          accountId: tableSelectedItem[0].accountId,
          userId: tableSelectedItem[0].userId,
          email: tableSelectedItem[0].email,
          avatar: tableSelectedItem[0].avatar,
          fullName: tableSelectedItem[0].fullName,
          gender: tableSelectedItem[0].gender,
          address: tableSelectedItem[0].address,
          dateOfBirth: tableSelectedItem[0].dateOfBirth,
          phoneNumber: tableSelectedItem[0].phoneNumber,
        },
        // doctor: {
        //   id: tableSelectedItem[0].doctorId,
        //   name: tableSelectedItem[0].fullName,
        //   departmentName: tableSelectedItem[0].departmentName,
        //   position: PositionOfDoctor.dean,
        //   rank: RankOfDoctor.tienSi,
        //   phoneNumber: tableSelectedItem[0].phoneNumber,
        // },
      } as IAppointmentInfo);

      setCurrent(0);
      setSelectDepartment(defaultSelectOption);
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
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            disabled={current === 0}
            style={{ margin: "0 8px" }}
            onClick={() => prev()}
          >
            Quay lại
          </Button>
          <Button
            type="primary"
            disabled={
              current === stepperItem.length - 1
                ? tableSelectedCount !== 1
                : selectDepartment.value === defaultSelectOption.value
            }
            onClick={() =>
              current === stepperItem.length - 1 ? handleOk() : next()
            }
          >
            {current === stepperItem.length - 1 ? "Hoàn thành" : "Tiếp theo"}
          </Button>
        </div>
      </Modal>
    );
  };

  const renderCureProcess = () => {
    const renderCureProcesFooter = () => {
      return <> Footer</>;
    };

    const handleCancel = () => {
      setOpenProcess(false);
    };

    const handleOk = () => {
      setOpenProcess(false);
    };

    return (
      <Modal
        title="Chỉ định bác sĩ"
        footer={renderCureProcesFooter}
        open={isOpenProcess}
        onOk={handleOk}
        onCancel={handleCancel}
        width={900}
      >
        Bắt đầu quá trình khám
      </Modal>
    );
  };

  return (
    <>
      <Row className="appointmentList-container">
        <Col className="list-section">
          <Row style={{ justifyContent: "space-between" }}>
            <Title level={4}>Danh sách lịch hẹn</Title>
            <Button
              icon={<UndoOutlined />}
              onClick={() => {
                callScheduleList();
              }}
            >
              Làm mới
            </Button>
          </Row>
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
        </Col>
        {renderScheduleStepper()}
        {renderCureProcess()}
      </Row>
    </>
  );
}

export default Schedule;
