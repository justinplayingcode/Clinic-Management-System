import {
  Avatar,
  Button,
  Col,
  Descriptions,
  Form,
  Modal,
  Row,
  Timeline,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { Utils } from "../../../utils";
import { Role } from "../../model/enum/auth";
import BasicInfoForm from "./components/BasicInfo";
import "./index.scss";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { RcFile, UploadChangeParam } from "antd/es/upload";

function Overview() {
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const [isOpen, setOpen] = useState<boolean>(false);
  const [closable, setClosable] = useState<boolean>(true);
  const [form] = Form.useForm();

  const { role, info, phoneNumber } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!info?.fullName) {
      setOpen(true);
      setClosable(false);
    }
    setImageUrl(info.avatar);
  }, []);

  const getInfoAddress = () => {
    const list = [];
    if (info.address) list.push(info.address);
    list.push(info.commune, info.district, info.city);

    return list.join(", ");
  };

  const onCloseModel = () => {
    setOpen(false);
    form.resetFields();
  };

  const renderSectionForAdmin = (): JSX.Element => {
    return <>admin</>;
  };

  const renderSection = (): JSX.Element => {
    return (
      <>
        <div className="overview-section-item">
          <div className="title">Lịch trình</div>
          <div className="detail">
            <Timeline
              mode={"left"}
              items={[
                {
                  label: "2015-09-01",
                  children: "Create a services",
                },
                {
                  label: "2015-09-01",
                  children: "Solve initial network problems",
                },
                {
                  label: "2015-09-01",
                  children: "Technical testing",
                },
                {
                  label: "2015-09-01",
                  children: "Network problems being solved",
                },
                {
                  label: "2015-09-01",
                  children: "Network problems being solved",
                },
              ]}
            />
          </div>
        </div>
        <div className="overview-section-item">
          {role === Role.doctor ? (
            <Descriptions
              style={{ flex: 1 }}
              title="Chi tiết lịch hẹn tiếp theo"
            >
              <Descriptions.Item label="Bệnh nhân" span={2}>
                --
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">Nam</Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">--</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">--</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                --
              </Descriptions.Item>
              <Descriptions.Item label="Triệu chứng" span={2}>
                --
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Descriptions
              style={{ flex: 1 }}
              title="Chi tiết lịch hẹn tiếp theo"
            >
              <Descriptions.Item label="Bác sĩ" span={2}>
                {info.fullName || "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Khoa">--</Descriptions.Item>
              <Descriptions.Item label="Chức vụ">--</Descriptions.Item>
              <Descriptions.Item label="Học vị">--</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">--</Descriptions.Item>
              <Descriptions.Item label="Người khám" span={2}>
                --
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">--</Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">--</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">--</Descriptions.Item>
              <Descriptions.Item label="Triệu chứng" span={2}>
                --
              </Descriptions.Item>
            </Descriptions>
          )}
        </div>
      </>
    );
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    // if (info.file.status === "uploading") {
    //   setLoading(true);
    //   return;
    // }
    // if (info.file.status === "done") {
    // Get this url from response in real world.
    getBase64(info.file.originFileObj as RcFile, (url) => {
      setLoading(false);
      setImageUrl(url);
    });
    // }
  };

  const defaultAvatar =
    "https://res.cloudinary.com/dipiauw0v/image/upload/v1682100699/DATN/unisex_avatar.jpg?fbclid=IwAR0rfobILbtfTZlNoWFiWmHYPH7bPMKFP0ztGnT8CVEXtvgTOEPEBgYtxY8";

  return (
    <>
      <div id="overview-wrapper">
        <Col className="personalInfo-container">
          <Row className="avatar-container">
            <Row className="left-container">
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl !== defaultAvatar ? (
                  <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                ) : (
                  uploadButton
                )}
              </Upload>
              {/* <Avatar shape="square" size={132} src={info.avatar} /> */}
              <Descriptions style={{ flex: 1 }}>
                <Descriptions.Item label="Họ và tên" span={12}>
                  {info.fullName || "--"}
                </Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                  {Utils.getGenderText(info.gender)}
                </Descriptions.Item>
                <Descriptions.Item label="Vai trò">
                  {Utils.renderAccountRole(role)}
                </Descriptions.Item>
              </Descriptions>
            </Row>
            <Button onClick={() => setOpen(true)}>Cập nhật</Button>
          </Row>
          <Col className="info-container">
            <Descriptions bordered title="Thông tin cá nhân">
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
            </Descriptions>
            {role === Role.doctor && (
              <Descriptions bordered title="Thông tin bác sĩ">
                <Descriptions.Item label="Khoa">
                  {info.departmentName}
                </Descriptions.Item>
                <Descriptions.Item label="Chức vụ">
                  {Utils.getDoctorPositionText(info.position)}
                </Descriptions.Item>
                <Descriptions.Item label="Học vấn">
                  {Utils.getDoctorRankText(info.rank)}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Col>
        </Col>
        <div className="overview-section">
          {role === Role.admin ? renderSectionForAdmin() : renderSection()}
        </div>
      </div>
      <Modal
        centered
        width={800}
        open={isOpen}
        onOk={onCloseModel}
        onCancel={onCloseModel}
        closable={closable}
        keyboard={false}
        maskClosable={false}
        footer={() => <></>}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Title level={4}>Cập nhật thông tin cá nhân</Title>
        </div>
        <div>
          <BasicInfoForm form={form} value={info} dismissForm={onCloseModel} />
        </div>
      </Modal>
    </>
  );
}

export default Overview;
