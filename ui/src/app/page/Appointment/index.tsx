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
import { RangePickerProps } from "antd/es/date-picker";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  ServiceType,
  TimeFrame,
  genderList,
  patientRelationshipList,
  toastType,
} from "../../model/enum/common";
import "./index.scss";
import { scheduleApi, serviceApi } from "../../../api";
import {
  closeLoading,
  openLoading,
  showToastMessage,
} from "../../../redux/reducers";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { routerString } from "../../model/router";
import ProvincesUtils from "../../../utils/provinces";

const { Text } = Typography;
interface ISelectOption {
  value: string;
  label: string;
}

type FieldType = {
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  insurance?: string;

  city?: string;
  district?: string;
  commune?: string;
  address?: string;

  appointmentDate: string;
  appointmentTime: string;
  appointmentType?: string;
  appointmentReason: string;

  guardianName?: string;
  guardianPhoneNumber?: string;
  relationship?: string;
};

const appointmentTimeOptions = [
  {
    value: TimeFrame.Morning,
    label: "Sáng (8h - 11h30)",
  },
  {
    value: TimeFrame.Afternoon,
    label: "Chiều (13h - 16h30)",
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
  const navigate = useNavigate();

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
  const [appointmentTypeList, setAppointmentTypeList] = useState<
    ISelectOption[]
  >([]);
  const [appointmentType, setAppointmentType] = useState<ISelectOption>({
    value: "",
    label: "",
  });

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
  };

  const callApiAppointmentType = () => {
    const result: any[] = [];
    serviceApi.getAll().then((response) => {
      response?.data?.forEach((item: any) => {
        if (item.type === ServiceType.Basic) {
          result.push({
            value: item?._id,
            label: item?.displayName,
          });
        }
      });
      setAppointmentTypeList(result);
    });
  };

  useEffect(() => {
    setCityList(ProvincesUtils.getAllCityName());
    if (city.label !== '') {
      setDistrictList(ProvincesUtils.getAllDistrictByCity(city.label));
    }
    if (district.label !== '') {
      setDistrictList(ProvincesUtils.getAllWardByCity(district.label));
    }
    callApiAppointmentType();
  }, []);

  useEffect(() => {
    setDistrictList(ProvincesUtils.getAllDistrictByCity(city.label));
  }, [city.label]);

  useEffect(() => {
    setComuneList(ProvincesUtils.getAllWardByCity(district.label));
  }, [district.label]);

  const onFinish = (values: any) => {
    values.dateOfBirth = values["dateOfBirth"].format("MM/DD/YYYY");
    values.appointmentDate = values["appointmentDate"].format("MM/DD/YYYY");
    values["city"] = values.city?.label ?? values.city;
    values["district"] = values.district?.label ?? values.district;
    values["commune"] = values.commune?.label ?? values.commune;
    values["address"] = values?.address || "";
    values["guardianName"] = values?.guardianName ?? "";
    values["guardianPhoneNumber"] = values?.guardianPhoneNumber ?? "";
    values["relationship"] =
      patientRelationshipList[values?.relationship]?.label || "";
    const body = {
      ...values,
      appointmentTypeId: values?.appointmentType.value,
      appointmentType: undefined,
    };
    dispatch(openLoading());
    scheduleApi
      .userCreateSchedule(body)
      .then((result: any) => {
        if (result.isSuccess) {
          dispatch(
            showToastMessage({
              message: "Hẹn lịch thành công",
              type: toastType.succes,
            })
          );
          navigate(`${routerString.schedule}`);
        } else {
          showToastMessage({
            message: result.message,
            type: toastType.error,
          });
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

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <div className="appointment-form-title">Thông tin đăng ký khám bệnh</div>
      <Form
        form={form}
        name="basic-appointment"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout={"vertical"}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Col style={{ padding: "0 32px" }}>
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
                  label="Số thẻ BHYT"
                  name="insurance"
                  rules={[{ required: true, message: "Hãy nhập số thẻ BHYT!" }]}
                >
                  <Input placeholder="Nhập số thẻ BHYT" />
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
                <Col span={8} style={{ flex: 1 }}>
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
                <Col span={8} style={{ flex: 1 }}>
                  <Form.Item<FieldType>
                    label="Loại khám"
                    name="appointmentType"
                    rules={[{ required: true, message: "Hãy chọn loại khám!" }]}
                  >
                    <Select
                      labelInValue
                      placeholder="Chọn loại khám"
                      options={appointmentTypeList}
                      value={appointmentType}
                      onChange={(value: { value: string; label: string }) => {
                        setAppointmentType({
                          value: value.value,
                          label: value.label,
                        });
                      }}
                    ></Select>
                  </Form.Item>
                </Col>
                <Col span={8} style={{ flex: 1 }}>
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
    </>
  );
}

export default Appointment;
