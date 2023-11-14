import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux";
import { Role } from "../../../../model/enum/auth";
import { Avatar, Button, Col, Form, Modal, Row, Select } from "antd";
import {
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import { Gender } from "../../../Appointment/utils";
import {
  PositionDoctorList,
  RankDoctorList,
} from "../../../../model/enum/common";
import { useEffect, useState } from "react";
import { departmentApi } from "../../../../../api";
import Title from "antd/es/typography/Title";

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
        <Col className="personalInfo-container">
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
                <span className="info-details-info">{`Ngày sinh: ${
                  info.dateOfBirth || "--"
                }`}</span>
              </Row>
              <Row className="info-details">
                <PhoneOutlined />
                <span className="info-details-info">{`Số điện thoại: ${
                  phoneNumber || "--"
                }`}</span>
              </Row>
              <Row className="info-details">
                <MailOutlined />
                <span className="info-details-info">{`Email: ${
                  info?.email || "--"
                }`}</span>
              </Row>
              <Row className="info-details">
                <HomeOutlined />
                <span className="info-details-info">{`Địa chỉ: ${
                  getInfoAddress() || "--"
                }`}</span>
              </Row>
              {role === Role.doctor && (
                <>
                  <Row className="info-details">
                    <HomeOutlined />
                    <span className="info-details-info">{`Khoa: ${
                      getInfoAddress() || "--"
                    }`}</span>
                  </Row>
                  <Row className="info-details">
                    <HomeOutlined />
                    <span className="info-details-info">{`Chức vụ: ${
                      getInfoAddress() || "--"
                    }`}</span>
                  </Row>
                  <Row className="info-details">
                    <HomeOutlined />
                    <span className="info-details-info">{`Học vấn: ${
                      getInfoAddress() || "--"
                    }`}</span>
                  </Row>
                </>
              )}
            </Col>
          </Col>
        </Col>
        {/* {role === Role.doctor && ( */}
        <Col>
          <Button type="primary" onClick={() => setOpen(true)}>
            Chỉnh sửa thông tin
          </Button>
        </Col>
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
