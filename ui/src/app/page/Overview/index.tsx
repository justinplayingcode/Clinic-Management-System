import {
  Avatar,
  Button,
  Col,
  Descriptions,
  Form,
  Modal,
  Row,
  Upload
} from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { Utils } from "../../../utils";
import { Role } from "../../model/enum/auth";
import BasicInfoForm from "./components/BasicInfo";
import "./index.scss";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { closeLoading, openLoading, setInfoUser, showToastMessage } from "../../../redux/reducers";
import { toastType } from "../../model/enum/common";
import { authApi } from "../../../api";

function Overview() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [closable, setClosable] = useState<boolean>(true);
  const [form] = Form.useForm();
  const { role, info, phoneNumber } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (!info?.fullName) {
      setOpen(true);
      setClosable(false);
    }
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

  const getInfo = () => {
    dispatch(openLoading());
    authApi.getInfoCurrentUser()
    .then((result: any) => {
      if (result.isSuccess) {
        dispatch(setInfoUser(result.data))
      }
    })
    .finally(() => {
      dispatch(closeLoading());
    });
  }

  const uploadAvatar = () => {
    const [visible, setVisible] = useState(false);
    const [fileList, setFileList] = useState<any>([]);
    const handleCancel = () => {
      setVisible(false)
      setFileList([])
    };
    const handleOk = () => {
      const formData = new FormData();
      formData.append('avatar', fileList[0].originFileObj);
      dispatch(openLoading());
      authApi.updateAvatar(formData)
        .then((result: any) => {
          if (result.isSuccess) {
            dispatch(
              showToastMessage({
                message: "Cập nhật ảnh đại diện thành công",
                type: toastType.succes,
              })
            );
            getInfo();
            handleCancel();
          } else {
            showToastMessage({
              message: "Có lỗi, hãy thử lại",
              type: toastType.error,
            })
          }
        })
        .catch(() => {
          dispatch(
            showToastMessage({
              message: "Có lỗi, hãy thử lại",
              type: toastType.error,
            })
          );
        })
        .finally(() => {
          dispatch(closeLoading());
        });
    };

    return (
      <>
        <Button onClick={() => setVisible(true)}>Đổi ảnh đại diện</Button>
        <Modal
          title="Tải ảnh mới"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Upload
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            listType="picture"
            accept="image/png, image/jpeg"
            maxCount={1}
            fileList={fileList}
            className="upload-list-inline"
            onChange={(info) => {
              setFileList([info.file])
              if (info.file.status === 'error') {
                dispatch(showToastMessage({ message: "Có lỗi, vui lòng chọn ảnh khác", type: toastType.error}))
                setFileList([])
              }
            }}
          >
            <Button icon={<UploadOutlined />}>Tải lên</Button>
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
