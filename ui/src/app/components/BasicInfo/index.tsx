import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";

interface IBasicInfoProps {
  dismissForm: () => void;
  value?: string;
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

const gender = [
  {
    value: 0,
    label: "Nam",
  },
  {
    value: 1,
    label: "Nữ",
  },
];

interface ISelectOption {
  value: string;
  label: string;
}

const BasicInfoForm = (props: IBasicInfoProps) => {
  const { dismissForm, value } = props;
  const [form] = Form.useForm();

  const defaultSelectOption: ISelectOption = {
    value: "",
    label: "",
  };

  const [info, setInfo] = useState<string>(value || "");

  const [city, setCity] = useState<ISelectOption>(defaultSelectOption);
  const [district, setDistrict] = useState<ISelectOption>(defaultSelectOption);
  const [commune, setCommune] = useState<ISelectOption>(defaultSelectOption);
  const [details, setDetails] = useState<string>("");

  const [cityList, setCityList] = useState<ISelectOption[]>([]);
  const [districtList, setDistrictList] = useState<ISelectOption[]>([]);
  const [communeList, setComuneList] = useState<ISelectOption[]>([]);

  const selectStyle = {
    width: "100%",
  };

  const host = "https://provinces.open-api.vn/api/";

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
  useEffect(() => {
    callAPI(host);
    //   if (value) {
    //     const addressToList = value.split("*");
    //     if (addressToList.length) {
    //       setDetails(addressToList[3]);
    //     }
    //   }
  }, []);

  //   useEffect(() => {
  //     if (value && cityList.length > 0) {
  //       const cityName = value.split("*")[0];
  //       const currentCity = cityList.find((city) => city.label === cityName);
  //       if (currentCity) setCity(currentCity);
  //     }
  //   }, [cityList]);

  useEffect(() => {
    callApiDistrict(`${host}p/${city.value}?depth=2`);
  }, [city]);

  //   useEffect(() => {
  //     if (value && districtList.length > 0) {
  //       const districtName = value.split("*")[1];
  //       const currentDistrict = districtList.find(
  //         (district) => district.label === districtName
  //       );
  //       if (currentDistrict) setDistrict(currentDistrict);
  //     }
  //   }, [districtList]);

  useEffect(() => {
    callApiWard(`${host}d/${district.value}?depth=2`);
  }, [district]);

  //   useEffect(() => {
  //     if (value && communeList.length > 0) {
  //       const communeName = value.split("*")[2];
  //       const currentCommine = communeList.find(
  //         (commune) => commune.label === communeName
  //       );
  //       if (currentCommine) setCommune(currentCommine);
  //     }
  //   }, [communeList]);

  const onFinish = (values: any) => {
    // values["gender"] =
    //   gender.find((gen) => gen.value === values.gender)?.label || "Nam";
    values["dateOfBirth"] = moment(values.dateOfBirth).format("MM/DD/YYYY");
    values["city"] = values.city.label;
    values["district"] = values.district.label;
    values["commune"] = values.commune.label;
    values["address"] = values.address || "";

    // const addressList = address.split("*");
    // console.log(addressList);
    // console.log(addressList.length);

    // switch (addressList.length) {
    //   case 0:
    //     setErrorAddress({
    //       city: "Hãy chọn Tỉnh/Thành Phố",
    //     });
    //     return;
    //   case 1:
    //     setErrorAddress({
    //       district: "Hãy chọn Quận/Huyện",
    //     });
    //     return;
    //   case 2:
    //     setErrorAddress({
    //       commune: "Hãy chọn Xã/Phường",
    //     });
    //     return;
    //   default:
    // }
    // if (addressList.length < 2) {
    // }

    // values["address"] = address;
    console.log("Success:", values);
    dismissForm();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={{ padding: "0 24px" }}>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout={"vertical"}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Row style={{ gap: "40px" }}>
          <Col span={12} style={{ flex: 1 }}>
            <Form.Item<FieldType>
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: "Hãy nhập Họ và tên!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12} style={{ flex: 1 }}>
            <Form.Item<FieldType>
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Hãy chọn giới tính!" }]}
            >
              <Select options={gender}></Select>
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
              />
            </Form.Item>
          </Col>
          <Col span={12} style={{ flex: 1 }}>
            <Form.Item<FieldType>
              label="Email"
              name="email"
              rules={[{ type: "email" }]}
            >
              <Input />
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

                  // reset district, commune, details value
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
                  // borderColor: errorMessage?.district && "#ff4d4f",
                }}
                placeholder="Chọn Quận/Huyện"
                options={districtList}
                value={district}
                onChange={(value: { value: string; label: string }) => {
                  setDistrict({
                    value: value.value,
                    label: value.label,
                  });
                  // reset commune, details value
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
                  // borderColor: errorMessage?.commune && "#ff4d4f",
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
              {/* <Text style={{ display: "block", width: "83%" }}>Địa chỉ</Text> */}
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
