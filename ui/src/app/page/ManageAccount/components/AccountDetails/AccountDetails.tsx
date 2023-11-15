import { ManOutlined, WomanOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Descriptions,
  Form,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { departmentApi } from "../../../../../api";
import { RootState } from "../../../../../redux";
import {
  PositionDoctorList,
  RankDoctorList,
} from "../../../../model/enum/common";
import { Gender } from "../../../Appointment/utils";
import "./AccountDetails.scss";
import { Role } from "../../../../model/enum/auth";

const { Text } = Typography;

type FieldType = {
  fullName?: string;
  gender?: string;
  dateOfBirth?: string;
  email?: string;
  city?: string;
  district?: string;
  commune?: string;
  address?: string;
  phoneNumber?: string;
  rank?: string;
  departmentId?: string;
  position?: string;
};

interface ISelectOption {
  value: string;
  label: string;
}

const AccountDetails = () => {
  const { info, phoneNumber, role } = useSelector(
    (state: RootState) => state.auth
  );
  const [isOpen, setOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [departmentList, setDepartmentList] = useState<ISelectOption[]>([]);

  const renderAccountRole = (role: Role | null) => {
    switch (role) {
      case Role.admin:
        return "Quản trị viên";
      case Role.doctor:
        return "Bác sĩ";
      case Role.user:
        return "Người dùng";
      default:
        return "--";
    }
  };

  const renderGenderInfo = (gender: Gender) => {
    switch (gender) {
      case Gender.Male:
        return (
          <div style={{ fontSize: "16px", color: "#00A2FF" }}>
            <ManOutlined
              style={{ fontSize: "16px", color: "#00A2FF", margin: "0 4px" }}
            />
            <span>Nam</span>
          </div>
        );
      case Gender.Female:
        return (
          <div style={{ fontSize: "16px", color: "#00A2FF" }}>
            <WomanOutlined
              style={{ fontSize: "16px", color: "#FF4785", margin: "0 4px" }}
            />
            <span>Nữ</span>
          </div>
        );
      default:
        return <></>;
    }
  };

  const getInfoAddress = () => {
    const list = [];
    if (info.address) list.push(info.address);
    list.push(info.commune, info.district, info.city);

    return list.join(", ");
  };

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
  useEffect(() => {
    callApiDepartment();
  }, []);

  const onFinish = (values: any) => {
    values.dateOfBirth = values["dateOfBirth"].format("MM/DD/YYYY");
    values["city"] = values.city.label;
    values["district"] = values.district.label;
    values["commune"] = values.commune.label;
    values["address"] = values.address || "";
    values["email"] = values.email || "";

    // dispatch(openLoading());
    // authApi
    //   .registerDoctor(values)
    //   .then(() => {
    //     dispatch(
    //       showToastMessage({
    //         message: "Tạo tài khoản thành công",
    //         type: toastType.succes,
    //       })
    //     );
    //     dismissForm();
    //     dispatch(tableRefresh());
    //   })
    //   .catch(() => {
    //     dispatch(
    //       showToastMessage({
    //         message: "Có lỗi, hãy thử lại",
    //         type: toastType.error,
    //       })
    //     );
    //   })
    //   .finally(() => {
    //     dispatch(closeLoading());
    //   });
  };

  const onFinishFailed = (_: any) => {
    // dispatch(
    //   showToastMessage({
    //     message: "Hãy điền các trường còn trống",
    //     type: toastType.error,
    //   })
    // );
  };

  return (
    <>
      <Col>
        <Col className="accountInfo-container">
          <Col className="avatar-container">
            <Avatar shape="square" size={132} src={info.avatar} />
            <Col className="top-info">
              <Row style={{ justifyContent: "center" }}>
                <Text style={{ fontSize: "20px", fontWeight: 700 }}>
                  {renderAccountRole(role)}
                </Text>
              </Row>
              <Row style={{ justifyContent: "center" }}>
                <span style={{ fontSize: "20px", fontWeight: 700 }}>
                  {info.fullName || "--"}
                </span>
                {renderGenderInfo(info.gender)}
              </Row>
            </Col>
          </Col>
          <Col className="info-container">
            <Descriptions bordered title="Thông tin tài khoản">
              <Descriptions.Item label="Ngày sinh">
                {info.dateOfBirth || "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {phoneNumber || "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {info?.email || "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={24}>
                {getInfoAddress() || "--"}
              </Descriptions.Item>
              {/* {role === Role.doctor && ( */}
              <>
                <Descriptions.Item label="Khoa">
                  No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                </Descriptions.Item>
                <Descriptions.Item label="Chức vụ">
                  No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                </Descriptions.Item>
                <Descriptions.Item label="Học vấn">
                  No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                </Descriptions.Item>
              </>
              {/* )} */}
            </Descriptions>
            <Row style={{ justifyContent: "center", marginTop: "20px" }}>
              <Button type="primary" onClick={() => setOpen(true)}>
                Chỉnh sửa thông tin
              </Button>
            </Row>
          </Col>
        </Col>
        {/* {role === Role.doctor && ( */}
        {/* )} */}
        <Modal
          centered
          width={400}
          open={isOpen}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          closable={true}
          keyboard={false}
          maskClosable={false}
          footer={() => <></>}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Title level={4}>Sửa thông tin bác sĩ</Title>
          </div>
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            layout={"vertical"}
            style={{ maxWidth: 800 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            // initialValues={_initialValues(value)}
          >
            <Form.Item<FieldType>
              label="Khoa"
              name="departmentId"
              rules={[{ required: true, message: "Hãy chọn khoa!" }]}
            >
              <Select placeholder="Chọn khoa" options={departmentList}></Select>
            </Form.Item>

            <Form.Item<FieldType>
              label="Chức vụ"
              name="position"
              rules={[{ required: true, message: "Hãy chọn chức vụ!" }]}
            >
              <Select
                placeholder="Chọn chức vụ"
                options={PositionDoctorList}
              ></Select>
            </Form.Item>
            <Form.Item<FieldType>
              label="Học vấn"
              name="rank"
              rules={[{ required: true, message: "Hãy chọn học vấn!" }]}
            >
              <Select
                placeholder="Chọn học vấn"
                options={RankDoctorList}
              ></Select>
            </Form.Item>
            <Form.Item>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button type="primary" htmlType="submit">
                  <span>Xác nhận thông tin</span>
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </Col>
    </>
  );
};

export default AccountDetails;
