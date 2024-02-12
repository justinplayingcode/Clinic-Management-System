import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { Utils } from "../../../../../utils";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import {
  closeLoading,
  openLoading,
  setInfoUser,
  showToastMessage,
} from "../../../../../redux/reducers";
import { genderList, toastType } from "../../../../model/enum/common";
import { userApi } from "../../../../../api";
import ProvincesUtils from "../../../../../utils/provinces";

interface IBasicInfoProps {
  dismissForm: () => void;
  value?: any;
  form: any;
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

const BasicInfoForm = (props: IBasicInfoProps) => {
  const { dismissForm, value, form } = props;

  const dispatch = useDispatch();

  const [city, setCity] = useState<ISelectOption>({
    value: "",
    label: value.city || "",
  });
  const [district, setDistrict] = useState<ISelectOption>({
    value: "",
    label: value.district || "",
  });
  const [commune, setCommune] = useState<ISelectOption>({
    value: "",
    label: value.commune || "",
  });
  const [details, setDetails] = useState<string>(value.address || "");
  const [cityList, setCityList] = useState<ISelectOption[]>([]);
  const [districtList, setDistrictList] = useState<ISelectOption[]>([]);
  const [communeList, setComuneList] = useState<ISelectOption[]>([]);

  useEffect(() => {
    setCityList(ProvincesUtils.getAllCityName());
    if (city.label !== '') {
      setDistrictList(ProvincesUtils.getAllDistrictByCity(city.label));
    }
    if (district.label !== '') {
      setDistrictList(ProvincesUtils.getAllWardByCity(district.label));
    }
  }, []);

  useEffect(() => {
    setDistrictList(ProvincesUtils.getAllDistrictByCity(city.label));
  }, [city.label]);

  useEffect(() => {
    setComuneList(ProvincesUtils.getAllWardByCity(district.label));
  }, [district.label]);

  useEffect(() => {
    form.resetFields();
  }, [value])

  const onFinish = (values: any) => {
    values.dateOfBirth = values["dateOfBirth"].format("MM/DD/YYYY");
    values["city"] = values.city.label;
    values["district"] = values.district.label;
    values["commune"] = values.commune.label;
    values["address"] = values.address || "";
    values["email"] = values.email || "";
    dispatch(openLoading());
    userApi
      .updateInfo(values)
      .then(() => {
        dispatch(
          showToastMessage({
            message: "Cập nhật thông tin thành công",
            type: toastType.succes,
          })
        );
        dispatch(
          setInfoUser({
            ...values,
            dateOfBirth: Utils.convertmmDDyyyyToDDmmyyyy(
              values?.dateOfBirth ?? "--"
            ),
          })
        );
        dismissForm();
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
              label="Tỉnh/Thành phố"
              name="city"
              rules={[{ required: true, message: "Hãy chọn Tỉnh/Thành phố!" }]}
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
  );
};
export default BasicInfoForm;
