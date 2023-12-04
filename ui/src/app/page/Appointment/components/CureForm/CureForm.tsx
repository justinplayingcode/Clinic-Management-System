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
} from "../../../../model/enum/common";
import { Utils } from "../../../../../utils";
const { Text, Title } = Typography;

import "./CureForm.scss";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { medicationApi, serviceApi } from "../../../../../api";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { IPersonaProps } from "@fluentui/react";
import Picker from "../../../components/picker";

interface ICureFormProps {
  isOpen: boolean;
  onDismiss: () => void;
  item: IAppointmentInfo | null | undefined;
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

    const medications = medication.map((item: any) => {
      return {
        id: item.id,
        displayName: item.displayName,
      };
    });

    const body = {
      id: item?._id,
      fullName: item?.patient.fullName,
      dateOfBirth: Utils.convertDDmmyyyTommDDyyyy(
        item?.patient.dateOfBirth ?? ""
      ),
      gender: item?.patient.gender,
      reason: item?.appointmentReason,

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
        list: medications,
        note: values.note,
      },
    };
    console.log("body", body);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
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
            <Descriptions.Item label="Mã khám bệnh">
              {item?._id || "-"}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col style={{ flex: 1, marginTop: "44px" }}>
          <Descriptions bordered>
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
        // layout="vertical"
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
                rules={[{ required: true, message: "Hãy nhập chiều cao" }]}
              >
                <Input addonAfter="cm" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<FieldType>
                label="Cân nặng"
                name="weight"
                rules={[{ required: true, message: "Hãy nhập cân nặng" }]}
              >
                <Input addonAfter="kg" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<FieldType>
                label="Nhịp tim"
                name="heartRate"
                rules={[{ required: true, message: "Hãy nhập nhịp tim" }]}
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
                rules={[{ required: true, message: "Hãy nhập nhiệt độ" }]}
              >
                <Input addonAfter="&#8451;" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<FieldType>
                label="Huyết áp"
                name="bloodPressure"
                rules={[{ required: true, message: "Hãy nhập huyết áp" }]}
              >
                <Input addonAfter="mmHg" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<FieldType>
                label="Đường huyết"
                name="glucose"
                rules={[{ required: true, message: "Hãy nhập đường huyết" }]}
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
            {/* <Button icon={<PlusOutlined />}>Thêm</Button> */}
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
                    <Form.Item {...field} name={[field.name, "item_service"]}>
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
