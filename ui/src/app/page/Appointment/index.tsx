import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd";

const { Title, Paragraph, Text } = Typography;
import "./index.scss";
import { TimeFrame } from "./utils";
import TextArea from "antd/es/input/TextArea";
import {
  genderList,
  host,
  patientRelationshipList,
} from "../../model/enum/common";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
interface ISelectOption {
  value: string;
  label: string;
}

type FieldType = {
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  identificationNumber?: string;

  city?: string;
  district?: string;
  commune?: string;
  address?: string;

  appointmentDate: string;
  appointmentTime: string;
  appointmentReason: string;

  guardianName?: string;
  guardianPhoneNumber?: string;
  relationship?: string;
};

const appointmentTimeOptions = [
  {
    value: TimeFrame.Morning,
    label: "7h30 - 11h30",
  },
  {
    value: TimeFrame.Afternoon,
    label: "14h - 16h ",
  },
];

const selectStyle = {
  width: "100%",
};

const defaultSelectOption: ISelectOption = {
  value: "",
  label: "",
};

function Appointment() {
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const [city, setCity] = useState<ISelectOption>({
    value: "",
    label: "",
  });
  const [district, setDistrict] = useState<ISelectOption>({
    value: "",
    label: "",
  });
  const [commune, setCommune] = useState<ISelectOption>({
    value: "",
    label: "",
  });
  const [details, setDetails] = useState<string>("");

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
      const result = response.data.wards?.map((item: any) => {
        return {
          value: item.code,
          label: item.name,
        };
      });
      setComuneList(result || []);
    });
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
  };

  useEffect(() => {
    callAPI(host);
  }, []);

  useEffect(() => {
    callApiDistrict(`${host}p/${city.value}?depth=2`);
  }, [city]);

  useEffect(() => {
    callApiWard(`${host}d/${district.value}?depth=2`);
  }, [district]);

  const onFinish = (values: any) => {
    values.dateOfBirth = values["dateOfBirth"].format("MM/DD/YYYY");

    values.appointmentDate = values["appointmentDate"].format("MM/DD/YYYY");

    values["city"] = values.city.label;
    values["district"] = values.district.label;
    values["commune"] = values.commune.label;
    values["address"] = values.address || "";
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div>
      Appointment
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout={"vertical"}
        // style={{ maxWidth: 800 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        //  initialValues={_initialValues(value)}
      >
        <Col style={{ padding: "32px" }}>
          <Col>
            <Row className="form-section-title">
              <Text strong>Thông tin bệnh nhân</Text>
            </Row>
          </Col>
          <Col>
            <Row style={{ gap: "40px" }}>
              <Col span={16} style={{ flex: 1 }}>
                <Form.Item<FieldType>
                  label="Họ và tên"
                  name="fullName"
                  rules={[{ required: true, message: "Hãy nhập họ và tên!" }]}
                >
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
              </Col>
              <Col span={8} style={{ flex: 1 }}>
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
                  label="Số điện thoại"
                  name="phoneNumber"
                  rules={[
                    { required: true, message: "Hãy nhập số điện thoại!" },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
              <Col span={12} style={{ flex: 1 }}>
                <Form.Item<FieldType>
                  label="CCCD/CMND"
                  name="identificationNumber"
                >
                  <Input placeholder="Nhập CCCD/CMND" />
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
            </Row>
            <Row>
              <Col span={24} style={{ flex: 1 }}>
                <Form.Item<FieldType> label="Địa chỉ" name="address">
                  <Input
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    disabled={!commune.label}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col>
            <Row className="form-section-title">
              <Text strong>Thông tin đặt khám</Text>
            </Row>
            <Col>
              <Row style={{ gap: "40px" }}>
                <Col span={12} style={{ flex: 1 }}>
                  <Form.Item<FieldType>
                    label="Ngày khám"
                    name="appointmentDate"
                    rules={[{ required: true, message: "Hãy chọn ngày khám!" }]}
                  >
                    <DatePicker
                      placeholder="Chọn ngày khám"
                      style={{ width: "100%" }}
                      format={"DD/MM/YYYY"}
                      disabledDate={disabledDate}
                    />
                  </Form.Item>
                </Col>
                <Col span={12} style={{ flex: 1 }}>
                  <Form.Item<FieldType>
                    label="Khung giờ khám"
                    name="appointmentTime"
                    rules={[
                      { required: true, message: "Hãy chọn khung giờ khám!" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn khung giờ khám"
                      options={appointmentTimeOptions}
                    ></Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ flex: 1 }}>
                  <Form.Item<FieldType>
                    label="Lý do"
                    name="appointmentReason"
                    rules={[{ required: true, message: "Hãy nhập lý do!" }]}
                  >
                    <TextArea rows={4} autoSize={{ minRows: 4, maxRows: 4 }} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Col>

          <Col>
            <Row className="form-section-title">
              <Text strong>Thông tin bổ sung</Text>
            </Row>
            <Row style={{ gap: "40px" }}>
              <Col span={12} style={{ flex: 1 }}>
                <Form.Item<FieldType> label="Người giám hộ" name="guardianName">
                  <Input placeholder="Nhập tên người giám hộ" />
                </Form.Item>
              </Col>
              <Col span={12} style={{ flex: 1 }}>
                <Form.Item<FieldType>
                  label="SĐT người giám hộ"
                  name="guardianPhoneNumber"
                >
                  <Input placeholder="Nhập số điện thoại người giám hộ" />
                </Form.Item>
              </Col>
              <Col span={12} style={{ flex: 1 }}>
                <Form.Item<FieldType> label="Mối quan hệ" name="relationship">
                  <Select
                    placeholder="Chọn mối quan hệ"
                    options={patientRelationshipList}
                  ></Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Form.Item>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button type="primary" htmlType="submit">
                <span>Đặt lịch</span>
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Form>
    </div>
  );
}

export default Appointment;
