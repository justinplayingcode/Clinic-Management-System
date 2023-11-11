import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  closeLoading,
  openLoading,
  showToastMessage,
  tableRefresh,
} from "../../../../redux/reducers";
import { authApi, departmentApi } from "../../../../api";
import {
  PositionDoctorList,
  RankDoctorList,
  genderList,
  toastType,
} from "../../../model/enum/common";
import dayjs from "dayjs";
import { Utils } from "../../../../utils";
import Title from "antd/es/typography/Title";

interface ICreateDoctorProps {
  isOpen: boolean;
  dismissForm: () => void;
  value?: any;
}

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

const _initialValues = (value: any) => {
  const _value = Utils.deepCopy(value);
  return {
    ..._value,
    dateOfBirth: _value.dateOfBirth
      ? dayjs(Utils.convertDDmmyyyTommDDyyyy(_value.dateOfBirth))
      : undefined,
    city: _value.city
      ? {
          value: "",
          label: _value.city,
        }
      : undefined,
    district: _value.district
      ? {
          value: "",
          label: _value.district,
        }
      : undefined,
    commune: _value.commune
      ? {
          value: "",
          label: _value.commune,
        }
      : undefined,
  };
};

const defaultSelectOption: ISelectOption = {
  value: "",
  label: "",
};
const selectStyle = {
  width: "100%",
};
const host = "https://provinces.open-api.vn/api/";

const CreateDoctor = (props: ICreateDoctorProps) => {
  const { isOpen, dismissForm, value } = props;

  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const [departmentList, setDepartmentList] = useState<ISelectOption[]>([]);
  const [city, setCity] = useState<ISelectOption>({
    value: "",
    label: value?.city || "",
  });
  const [district, setDistrict] = useState<ISelectOption>({
    value: "",
    label: value?.district || "",
  });
  const [commune, setCommune] = useState<ISelectOption>({
    value: "",
    label: value?.commune || "",
  });
  const [details, setDetails] = useState<string>(value?.address || "");

  const [cityList, setCityList] = useState<ISelectOption[]>([]);
  const [districtList, setDistrictList] = useState<ISelectOption[]>([]);
  const [communeList, setComuneList] = useState<ISelectOption[]>([]);

  const callAPI = (api: any) => {
    return axios.get(api).then((response) => {
      const result = response.data.map((item: any) => {
        return {
          value: item.code,
          label: item.name,
        };
      });
      setCityList(result || []);
    });
  };

  const callApiDistrict = (api: any) => {
    return axios.get(api).then((response) => {
      const result = response.data.districts?.map((item: any) => {
        return {
          value: item.code,
          label: item.name,
        };
      });
      setDistrictList(result || []);
    });
  };

  const callApiWard = (api: any) => {
    return axios.get(api).then((response) => {
      const result = response?.data.wards?.map((item: any) => {
        return {
          value: item.code,
          label: item.name,
        };
      });
      setComuneList(result || []);
    });
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
    callAPI(host);
    callApiDepartment();
  }, []);

  useEffect(() => {
    callApiDistrict(`${host}p/${city.value}?depth=2`);
  }, [city]);

  useEffect(() => {
    callApiWard(`${host}d/${district.value}?depth=2`);
  }, [district]);

  const onFinish = (values: any) => {
    values["dateOfBirth"] = moment(values.dateOfBirth).format("MM/DD/YYYY");
    values["city"] = values.city.label;
    values["district"] = values.district.label;
    values["commune"] = values.commune.label;
    values["address"] = values.address || "";
    values["email"] = values.email || "";

    console.log(values);
    dispatch(openLoading());
    authApi
      .registerDoctor(values)
      .then(() => {
        dispatch(
          showToastMessage({
            message: "Tạo tài khoản thành công",
            type: toastType.succes,
          })
        );
        dismissForm();
        dispatch(tableRefresh())
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

  const onFinishFailed = (_: any) => {
    dispatch(
      showToastMessage({
        message: "Hãy điền các trường còn trống",
        type: toastType.error,
      })
    );
  };

  return (
    <Modal
      centered
      width={800}
      open={isOpen}
      onOk={() => dismissForm()}
      onCancel={() => dismissForm()}
      closable={true}
      keyboard={false}
      maskClosable={false}
      footer={() => <></>}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Title level={4}>Tạo tài khoản bác sĩ</Title>
      </div>

      <div style={{ padding: "16px 64px 0 64px" }}>
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
          initialValues={_initialValues(value)}
        >
          <Row style={{ gap: "40px" }}>
            <Col span={12} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Hãy nhập họ và tên!" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Giới tính"
                name="gender"
                rules={[{ required: true, message: "Hãy chọn giới tính!" }]}
              >
                <Select
                  options={genderList}
                  placeholder="Chọn giới tính"
                ></Select>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ gap: "40px" }}>
            <Col span={12} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Ngày sinh"
                name="dateOfBirth"
                rules={[{ required: true, message: "Hãy chọn ngày sinh!" }]}
              >
                <DatePicker
                  placeholder="Chọn Ngày sinh"
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                />
              </Form.Item>
            </Col>
            <Col span={12} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Email"
                name="email"
                rules={[{ type: "email" }]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ gap: "40px" }}>
            <Col span={12} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Số điện thoại"
                name="phoneNumber"
                rules={[{ required: true, message: "Hãy nhập số điện thoại!" }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12} style={{ flex: 1 }}>
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
            </Col>
          </Row>
          <Row style={{ gap: "40px" }}>
            <Col span={12} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Khoa"
                name="departmentId"
                rules={[{ required: true, message: "Hãy chọn khoa!" }]}
              >
                <Select
                  placeholder="Chọn khoa"
                  options={departmentList}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={12} style={{ flex: 1 }}>
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
            </Col>
          </Row>

          <Row style={{ gap: "40px" }}>
            <Col span={12} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Tỉnh/Thành phố"
                name="city"
                rules={[
                  { required: true, message: "Hãy chọn Tỉnh/Thành phố!" },
                ]}
              >
                <Select
                  labelInValue
                  style={{
                    ...selectStyle,
                  }}
                  placeholder="Chọn Tỉnh/Thành phố"
                  options={cityList}
                  value={city}
                  onChange={(value: { value: string; label: string }) => {
                    setCity({
                      value: value.value,
                      label: value.label,
                    });
                    form.setFieldsValue({
                      district: undefined,
                      commune: undefined,
                    });
                    setDistrict(defaultSelectOption);
                    setCommune(defaultSelectOption);
                  }}
                ></Select>
              </Form.Item>
            </Col>

            <Col span={12} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Quận/Huyện"
                name="district"
                rules={[{ required: true, message: "Hãy chọn Quận/Huyện!" }]}
              >
                <Select
                  labelInValue
                  style={{
                    ...selectStyle,
                  }}
                  placeholder="Chọn Quận/Huyện"
                  options={districtList}
                  value={district}
                  onChange={(value: { value: string; label: string }) => {
                    setDistrict({
                      value: value.value,
                      label: value.label,
                    });
                    form.setFieldsValue({
                      commune: undefined,
                    });
                    setCommune(defaultSelectOption);
                  }}
                  disabled={!city.label}
                ></Select>
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ gap: "40px" }}>
            <Col span={12} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Phường/Xã"
                name="commune"
                rules={[{ required: true, message: "Hãy chọn Phường/Xã!" }]}
              >
                <Select
                  labelInValue
                  style={{
                    ...selectStyle,
                  }}
                  placeholder="Chọn Phường/Xã"
                  options={communeList}
                  value={commune}
                  onChange={(value: { value: string; label: string }) => {
                    setCommune({
                      value: value.value,
                      label: value.label,
                    });
                  }}
                  disabled={!district.label}
                ></Select>
              </Form.Item>
            </Col>

            <Col span={12} style={{ marginBottom: "24px", flex: 1 }}>
              <Form.Item<FieldType> label="Địa chỉ" name="address">
                <Input
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  disabled={!commune.label}
                />
              </Form.Item>
            </Col>
          </Row>
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
      </div>
    </Modal>
  );
};

export default CreateDoctor;
