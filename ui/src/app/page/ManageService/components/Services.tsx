import { EditOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Col, Empty, Form, Input, Modal, Row, Select } from "antd";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import "./Services.scss";
import Paragraph from "antd/es/typography/Paragraph";
import { serviceApi } from "../../../../api";
import { useDispatch, useSelector } from "react-redux";
import {
  closeLoading,
  openLoading,
  showToastMessage,
} from "../../../../redux/reducers";
import {
  IServiceInfo,
  ServiceType,
  toastType,
} from "../../../model/enum/common";
import { RootState } from "../../../../redux";
import { Role } from "../../../model/enum/auth";

type FieldType = {
  name?: string;
  type?: string;
  price?: string;
};

function Services() {
  const [form] = Form.useForm();
  const [appointmentList, setAppointmentList] = useState<IServiceInfo[]>([]);
  const [selectItem, setSelectItem] = useState<IServiceInfo>();
  const [isOpenAddEit, setAddEit] = useState<{
    open: boolean;
    isEdit: boolean;
  }>({
    open: false,
    isEdit: false,
  });

  const dispatch = useDispatch();
  const { role } = useSelector((state: RootState) => state.auth);

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
      setAppointmentList(result);
    });
  };

  useEffect(() => {
    callApiAllService();
  }, []);

  const renderServiceType = (type: ServiceType) => {
    switch (type) {
      case ServiceType.Basic:
        return <Text>Thông thường</Text>;
      case ServiceType.Other:
        return <Text>Khác</Text>;
      default:
        return <></>;
    }
  };

  const appointmentItem = (item: IServiceInfo, index: number) => {
    return (
      <Row
        key={`preview-container-${index}`}
        className={`preview-container ${
          selectItem?.id === item.id && "active"
        }`}
        onClick={() => setSelectItem(item)}
      >
        {/* <Col className="preview-avatar">
          <Avatar size="large" icon={<UserOutlined />} />
        </Col> */}
        <Row className="preview-info">
          <Col>
            <Row className="preview-name">
              <Text strong>{item.name}</Text>
            </Row>
          </Col>

          {selectItem?.id === item.id && (
            <RightOutlined style={{ color: "#00A2FF" }} />
          )}
        </Row>
      </Row>
    );
  };

  const renderItemTitleValue = (
    title: string | JSX.Element,
    value: string | JSX.Element
  ) => {
    return (
      <Row className="details-item">
        <Text strong>{title}</Text>
        <Text>{value}</Text>
      </Row>
    );
  };

  const renderAppointmentDetails = (item: IServiceInfo) => {
    return (
      <>
        <Col className="details-container">
          {/* <Text strong>Thông tin dịch vụ</Text> */}

          <Col className="details-content">
            {renderItemTitleValue(`Tên dịch vụ:`, item.name)}
            {renderItemTitleValue(`Loại:`, renderServiceType(item.type))}
            {renderItemTitleValue(`Giá tiền (VNĐ):`, item.price)}
          </Col>
        </Col>
      </>
    );
  };

  const renderManageButton = () => {
    return (
      <Row>
        {selectItem && (
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setAddEit({ open: true, isEdit: true });
              form.setFieldsValue({
                name: selectItem.name,
                type: selectItem.type,
                price: selectItem.price,
              });
            }}
          >
            Sửa
          </Button>
        )}
        <Button
          style={{ marginLeft: 8 }}
          icon={<PlusOutlined />}
          onClick={() => setAddEit({ open: true, isEdit: false })}
        >
          Thêm
        </Button>
      </Row>
    );
  };

  const handleCancelAddEdit = () => {
    setAddEit({ open: false, isEdit: false });
    form.resetFields();
  };

  const onFinish = (values: any) => {
    dispatch(openLoading());
    let api, body;
    const basicBody = {
      displayName: values.name,
      cost: values.price,
      type: values.type,
    };
    if (isOpenAddEit.isEdit) {
      api = serviceApi.updateService;
      body = {
        ...basicBody,
        id: selectItem!.id,
      };
    } else {
      api = serviceApi.createlService;
      body = { ...basicBody };
    }
    api(body)
      .then((result: any) => {
        if (result.isSuccess) {
          dispatch(
            showToastMessage({
              message: "Thành công",
              type: toastType.succes,
            })
          );
          setSelectItem(undefined);
          callApiAllService();
          handleCancelAddEdit();
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
  };

  return (
    <>
      <Row className="serviceList-container">
        <Col className="list-section">
          <Row style={{ justifyContent: "space-between" }}>
            <Title level={4}>Danh sách dịch vụ</Title>
            {role === Role.admin && renderManageButton()}
          </Row>
          <Paragraph>
            Vui lòng chọn một trong các dịch vụ để xem chi tiết
          </Paragraph>
          <Col className="list-container">
            {appointmentList.length > 0 ? (
              appointmentList.map((item, index) => appointmentItem(item, index))
            ) : (
              <Row style={{ justifyContent: "center", marginTop: "80px" }}>
                <Col style={{ flexDirection: "column" }}>
                  <Empty
                    description={<Text>Không tìm thấy dịch vụ nào.</Text>}
                  />
                </Col>
              </Row>
            )}
          </Col>
        </Col>
        <Col
          className="details-section"
          style={{ height: !selectItem ? "100%" : "" }}
        >
          <Col
            className="top-details"
            style={{ height: !selectItem ? "100%" : "" }}
          >
            <Title level={4}>Chi tiết dịch vụ</Title>
            {!selectItem ? (
              <Row style={{ justifyContent: "center", marginTop: "80px" }}>
                <Col style={{ flexDirection: "column" }}>
                  <Empty
                    description={
                      <Text>Vui lòng chọn một dịch vụ để xem chi tiết.</Text>
                    }
                  />
                </Col>
              </Row>
            ) : (
              renderAppointmentDetails(selectItem)
            )}
          </Col>
        </Col>
        <Modal
          title={isOpenAddEit.isEdit ? "Sửa khoa" : "Thêm khoa"}
          open={isOpenAddEit.open}
          footer={() => <></>}
          onCancel={handleCancelAddEdit}
        >
          <Form
            form={form}
            name="service"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            layout={"vertical"}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Tên dịch vụ"
              name="name"
              rules={[{ required: true, message: "Hãy nhập tên dịch vụ!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Loại"
              name="type"
              rules={[{ required: true, message: "Hãy chọn loại dịch vụ" }]}
            >
              <Select
                options={[
                  { value: ServiceType.Basic, label: "Khám bệnh" },
                  { value: ServiceType.Other, label: "Khác" },
                ]}
              ></Select>
            </Form.Item>

            <Form.Item<FieldType>
              label="Giá tiền"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập giá dịch vụ, giá phải là số!",
                  pattern: new RegExp("^[0-9]*$"),
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Row style={{ flex: 1, justifyContent: "center" }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Row>
            </Form.Item>
          </Form>
        </Modal>
      </Row>
    </>
  );
}

export default Services;
