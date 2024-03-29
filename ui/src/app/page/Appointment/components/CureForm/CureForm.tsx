import {
  Button,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { useDispatch } from "react-redux";
import {
  IAppointmentInfo,
  IServiceInfo,
  ServiceType,
  toastType,
} from "../../../../model/enum/common";
import { Utils } from "../../../../../utils";
const { Text } = Typography;

import "./CureForm.scss";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { medicationApi, scheduleApi, serviceApi } from "../../../../../api";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { IPersonaProps } from "@fluentui/react";
import Picker from "../../../components/picker";
import {
  closeLoading,
  openLoading,
  showToastMessage,
} from "../../../../../redux/reducers";

interface ICureFormProps {
  isOpen: boolean;
  onDismiss: () => void;
  item: IAppointmentInfo | null | undefined;
  callScheduleList: () => void;
}

type FieldType = {
  height?: string;
  weight?: string;
  heartRate?: string;
  temperature?: string;
  bloodPressure?: string;
  glucose?: string;

  services?: any[];

  diagnose?: string;
  summary?: string;

  note?: string;
};

interface ISelectOption {
  value: string;
  label: string;
}

const CureForm = (props: ICureFormProps) => {
  const { isOpen, onDismiss, item } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [serviceList, setServiceList] = useState<IServiceInfo[]>([]);
  const [serviceOptions, setServiceOptions] = useState<ISelectOption[]>([]);
  const [medication, setMedication] = useState<IPersonaProps[]>([]);
  const [serviceOptionCount, setServiceOptionCount] = useState<number>(0);

  const callApiAllService = () => {
    serviceApi.getAll().then((response) => {
      const result = response?.data?.map((item: any) => {
        return {
          id: item?._id,
          name: item?.displayName,
          type: item?.type,
          price: item?.cost,
        };
      });
      setServiceList(result);
      const options = response?.data
        ?.filter((item: any) => item?.type === ServiceType.Other)
        .map((item: any) => {
          return {
            value: item?._id,
            label: item?.displayName,
          };
        });
      setServiceOptions(options);
      setServiceOptionCount(options.length);
    });
  };

  useEffect(() => {
    callApiAllService();
  }, []);

  const renderCureProcesFooter = () => {
    return (
      <>
        <Button type="primary" onClick={() => form.submit()}>
          Hoàn thành
        </Button>
      </>
    );
  };

  const handleCancel = () => {
    onDismiss();
  };

  const handleOk = () => {
    onDismiss();
  };

  const validateUnique = (value: any, allValues: any) => {
    // count the number of occurrences of the value in the list
    const count = allValues.filter(
      (item: any) => item["item_service"] === value
    ).length;
    // if the count is more than one, return a validation error message
    if (count > 1) {
      return Promise.reject(new Error("Hãy chọn dịch vụ khác"));
    }
    // otherwise, return a validation success message
    return Promise.resolve();
  };

  const onFinish = (values: any) => {
    const services = values.items.map((item: any) => {
      const dataItem = serviceList.find((ser) => ser.id === item.item_service);
      return {
        id: dataItem?.id,
        name: dataItem?.name,
        price: dataItem?.price,
        note: item.note,
      };
    });

    const body = {
      id: item?._id,
      typeAppointmentId: item?.typeAppointmentId,
      indicator: {
        height: values.height,
        weight: values.weight,
        heartRate: values.heartRate,
        bloodPressure: values.bloodPressure,
        temperature: values.temperature,
        glucose: values.glucose,
      },
      services: services,
      diagnose: values.diagnose,
      summary: values.summary,
      medication: {
        list: medication,
        note: values.note,
      },
    };
    dispatch(openLoading());
    scheduleApi
      .complete(body)
      .then((result: any) => {
        if (result.isSuccess) {
          dispatch(
            showToastMessage({
              message: "Thành công",
              type: toastType.succes,
            })
          );
          onDismiss();
          props.callScheduleList();
        } else {
          showToastMessage({
            message: "Có lỗi, hãy thử lại",
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
    // if success, clear form
    form.resetFields();
  };

  const onFinishFailed = (_: any) => {
    dispatch(
      showToastMessage({
        message: "Hãy điền các trường còn trống",
        type: toastType.error,
      })
    );
  };

  const checkVerifyNumber = (_: any, value: any) => {
    if (value > 0 && value < 1000) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Giá trị là số lớn hơn 0!"));
  };

  const checkVerifyBloodPressure = (_: any, value: any) => {
    const regex = new RegExp("^\\d+\\/\\d+$");
    if (regex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Giá trị không hợp lệ, ví dụ: 120/80"));
  };

  return (
    <Modal
      title="Khám bệnh"
      centered
      footer={renderCureProcesFooter}
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1200}
      className="cureModal"
    >
      <Row className="user-info">
        <Col span={12}>
          <Descriptions bordered title="Thông tin bệnh nhân" column={1}>
            <Descriptions.Item label="Họ và tên ">
              {item?.patient.fullName || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
              {item?.patient.dateOfBirth || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              {Utils.getGenderText(Number(item?.patient.gender))}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col
          span={12}
          style={{ flex: 1, marginTop: "44px", paddingRight: "6px" }}
        >
          <Descriptions bordered>
            <Descriptions.Item label="Mã lịch khám bệnh" span={12}>
              {item?._id || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Lý do">
              {item?.appointmentReason || "-"}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Form
        form={form}
        name="basic-appointment"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="form-info"
      >
        <Col className="static-info">
          <Text strong style={{ fontSize: "16px" }}>
            Chỉ số
          </Text>
          <Row gutter={16} style={{ margin: 0 }}>
            <Col span={8}>
              <Form.Item<FieldType>
                label="Chiều cao"
                name="height"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập chiều cao",
                    validator: checkVerifyNumber,
                  },
                ]}
              >
                <Input addonAfter="cm" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<FieldType>
                label="Cân nặng"
                name="weight"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập cân nặng",
                    validator: checkVerifyNumber,
                  },
                ]}
              >
                <Input addonAfter="kg" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<FieldType>
                label="Nhịp tim"
                name="heartRate"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập nhịp tim",
                    validator: checkVerifyNumber,
                  },
                ]}
              >
                <Input addonAfter="bpm" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ margin: 0 }}>
            <Col span={8}>
              <Form.Item<FieldType>
                label="Nhiệt độ"
                name="temperature"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập nhiệt độ",
                    validator: checkVerifyNumber,
                  },
                ]}
              >
                <Input addonAfter="&#8451;" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<FieldType>
                label="Huyết áp"
                name="bloodPressure"
                rules={[
                  {
                    required: true,
                    message: "Giá trị không hợp lệ, ví dụ: 120/80",
                    validator: checkVerifyBloodPressure,
                  },
                ]}
              >
                <Input addonAfter="mmHg" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<FieldType>
                label="Đường huyết"
                name="glucose"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập đường huyết",
                    validator: checkVerifyNumber,
                  },
                ]}
              >
                <Input addonAfter="mg/dl" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row style={{ gap: "24px" }}>
            <Text strong style={{ fontSize: "16px" }}>
              Dịch vụ
            </Text>
          </Row>
          <Form.List name="items" initialValue={[]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space
                    key={`${field.key}_${index}`}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, "item_service"]}
                      rules={[
                        { required: true, message: "Hãy chọn dịch vụ" },
                        // use a custom validator function to check uniqueness
                        {
                          validator: (_, value) =>
                            validateUnique(value, form.getFieldValue("items")),
                        },
                      ]}
                    >
                      <Select
                        placeholder="Chọn dịch vụ"
                        options={serviceOptions}
                        style={{ minWidth: "200px" }}
                      ></Select>
                    </Form.Item>
                    <Text>Ghi chú: </Text>
                    <Form.Item {...field} name={[field.name, "note"]}>
                      <Input
                        placeholder="Ghi chú"
                        style={{ minWidth: "600px" }}
                      />
                    </Form.Item>

                    <MinusCircleOutlined
                      onClick={() => {
                        remove(field.name);
                        setServiceOptionCount(serviceOptionCount + 1);
                      }}
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                      setServiceOptionCount(serviceOptionCount - 1);
                    }}
                    block
                    disabled={serviceOptionCount === 0}
                    icon={<PlusOutlined />}
                  >
                    Thêm
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Col>
        <Row gutter={16} style={{ margin: 0 }}>
          <Col span={10} style={{ paddingLeft: 0 }}>
            <Text strong style={{ fontSize: "16px" }}>
              Kết luận
            </Text>
            <Form.Item<FieldType>
              label="Chẩn đoán"
              name="diagnose"
              rules={[{ required: true, message: "Hãy nhập chẩn đoán" }]}
            >
              <TextArea rows={4} autoSize={{ minRows: 4, maxRows: 4 }} />
            </Form.Item>
            <Form.Item<FieldType>
              label="Tổng quan"
              name="summary"
              rules={[{ required: true, message: "Hãy nhập tổng quan" }]}
            >
              <TextArea rows={4} autoSize={{ minRows: 4, maxRows: 4 }} />
            </Form.Item>
          </Col>
          <Col span={14}>
            <Text strong style={{ fontSize: "16px" }}>
              Thuốc
            </Text>
            <Row gutter={16} style={{ margin: 0 }}>
              <Col span={8}>
                <Picker
                  label={"Danh sách thuốc"}
                  onChangeCallBack={(value) => setMedication(value)}
                  value={medication}
                  integrateItems={medicationApi.pickerMedications}
                  mappingValues={(datas) => {
                    const values = datas.map((e: any) => {
                      return {
                        displayName: e.displayName,
                        text: e.displayName,
                        secondaryText: e.designation,
                        id: e._id,
                        usage: e.usage,
                        price: e.price,
                      };
                    });
                    return values;
                  }}
                  placeholder={"Nhập tên thuốc"}
                />
              </Col>
              <Col span={16}>
                <Form.Item<FieldType>
                  label="Ghi chú"
                  name="note"
                  rules={[{ required: true, message: "Hãy điền ghi chú" }]}
                >
                  <TextArea rows={4} autoSize={{ minRows: 4, maxRows: 4 }} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CureForm;
