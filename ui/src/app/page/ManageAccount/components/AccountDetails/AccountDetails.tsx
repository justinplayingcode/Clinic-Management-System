import {
  Avatar,
  Button,
  Col,
  Descriptions,
  Form,
  Modal,
  Row,
  Select,
} from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import { authApi, departmentApi, userApi } from "../../../../../api";
import {
  AccountType,
  PositionDoctorList,
  RankDoctorList,
  toastType,
} from "../../../../model/enum/common";
import "./AccountDetails.scss";
import { Utils } from "../../../../../utils";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { closeLoading, openLoading, showToastMessage } from "../../../../../redux/reducers";

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

interface IAccountDetails {
  type: AccountType;
}

const AccountDetails = ({ ...props }: IAccountDetails) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [departmentList, setDepartmentList] = useState<ISelectOption[]>([]);
  const [currentAccount, setCurrentAccount] = useState<any>({});
  const [initValue, setInitValue] = useState<any>({});

  const { id: param } = useParams();
  const dispatch = useDispatch();

  const getInfoAccount = () => {
    let api = userApi.doctorInfo;
    if (props.type === AccountType.account) {
      api = userApi.accoutInfo
    }
    dispatch(openLoading());
    callApiDepartment();
    api(param as string)
      .then((result) => {
        setCurrentAccount(result?.data)
        if (props.type === AccountType.doctor) {
          setInitValue({
            departmentId: result?.data?.departmentId,
            position: result?.data?.position,
            rank: result?.data?.rank
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
  }

  useEffect(() => {
    getInfoAccount();
  }, [])

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

  const onFinish = (values: any) => {
    const body = {
      ...values,
      id: param
    }
    dispatch(openLoading());
    authApi
      .updateDoctor(body)
      .then((result: any) => {
        if (result.isSuccess) {
          dispatch(
            showToastMessage({
              message: "Cập nhật thành công",
              type: toastType.succes,
            })
          );
          getInfoAccount();
          setOpen(false);
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

  const onCloseModel = () => {
    setOpen(false);
    form.resetFields();
  }

  return (
    <>
      <Col>
        <Col className="accountInfo-container">
          <Col className="avatar-container">
            <Avatar shape="square" size={132} src={currentAccount.avatar} />
            <Col className="top-info">
              <Descriptions>
                <Descriptions.Item label="Họ và tên" span={12}>
                  {currentAccount.fullName || "--"}
                </Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                  {Utils.getGenderText(currentAccount.gender)}
                </Descriptions.Item>
                <Descriptions.Item label="Vai trò">
                  {props.type === AccountType.doctor ? "Bác sĩ" : Utils.renderAccountRole(currentAccount.role)}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Col>
          <Col className="info-container">
            <Descriptions bordered title="Thông tin cá nhân">
              <Descriptions.Item label="Ngày sinh">
                {currentAccount .dateOfBirth || "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {currentAccount.phoneNumber || "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {currentAccount?.email || "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={24}>
                {currentAccount.address || "--"}
              </Descriptions.Item>
            </Descriptions>
              {props.type === AccountType.doctor && <Descriptions bordered title="Thông tin bác sĩ">
                <Descriptions.Item label="Khoa">
                  {currentAccount.departmentName}
                </Descriptions.Item>
                <Descriptions.Item label="Chức vụ">
                {Utils.getDoctorPositionText(currentAccount.position)}
                </Descriptions.Item>
                <Descriptions.Item label="Học vấn">
                  {Utils.getDoctorRankText(currentAccount.rank)}
                </Descriptions.Item>
              </Descriptions>}
            {props.type === AccountType.doctor && <Row style={{ justifyContent: "center", marginTop: "20px" }}>
              <Button type="primary" onClick={() => setOpen(true)}>
                Chỉnh sửa thông tin
              </Button>
            </Row>}
          </Col>
        </Col>
        {props.type === AccountType.doctor && <Modal
          centered
          width={400}
          open={isOpen}
          onCancel={onCloseModel}
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
            autoComplete="off"
            initialValues={initValue}
          >
            <Form.Item<FieldType>
              label="Khoa"
              name="departmentId"
            >
              <Select placeholder="Chọn khoa" options={departmentList}></Select>
            </Form.Item>

            <Form.Item<FieldType>
              label="Chức vụ"
              name="position"
            >
              <Select
                placeholder="Chọn chức vụ"
                options={PositionDoctorList}
              ></Select>
            </Form.Item>
            <Form.Item<FieldType>
              label="Học vấn"
              name="rank"
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
        </Modal>}
      </Col>
    </>
  );
};

export default AccountDetails;