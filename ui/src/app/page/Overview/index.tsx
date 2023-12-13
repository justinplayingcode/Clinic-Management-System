import {
  Avatar,
  Button,
  Col,
  Descriptions,
  Form,
  Modal,
  Row,
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
import {
  InboxOutlined,
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { RcFile, UploadChangeParam } from "antd/es/upload";
import Dragger from "antd/es/upload/Dragger";

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

  const uploadAvatar = () => {
    const [visible, setVisible] = useState(false);
    const [fileList, setFileList] = useState([]);

    const handleCancel = () => setVisible(false);

    const handleOk = () => {
      // do something with the uploaded file
      console.log(fileList[0]);
      setVisible(false);
    };

    return (
      <>
        <Button onClick={() => setVisible(true)}>Đổi ảnh đại diện</Button>
        <Modal
          title="Upload File"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Upload
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            listType="picture"
            defaultFileList={[...fileList]}
            className="upload-list-inline"
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Modal>
      </>
    );
  };

  return (
    <>
      <div id="overview-wrapper">
        <Col className="personalInfo-container">
          <Row className="avatar-container">
            <Row className="left-container">
              <Avatar shape="square" size={132} src={info.avatar} />
              <Row className="change-avatar-btn">{uploadAvatar()}</Row>
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
