import { AxiosResponse } from "axios";
import UniformTable from "../components/table";
import { ICommandBarItemProps } from "@fluentui/react";
import { useEffect, useState } from "react";
import { tooltipPlainText } from "../../../utils/basicRender";
import { medicationApi } from "../../../api";
import { Button, Col, Drawer, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { closeLoading, openLoading, showToastMessage, tableRefresh } from "../../../redux/reducers";
import { toastType } from "../../model/enum/common";
import "./index.scss"
import { Role } from "../../model/enum/auth";

type FieldType = {
  displayName?: string;
  designation?: string;
  usage?: string;
  price?: number;
};

function Medications() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [values, setValues] = useState<any>({});

  const { role } = useSelector((state: RootState) => state.auth);

  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const { tableSelectedCount, tableSelectedItem } = useSelector(
    (state: RootState) => state.currentSeleted
  );

  const Column = [
    {
      key: "displayName",
      name: "Tên thuốc",
      minWidth: 120,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.displayName)}</span>;
      },
    },
    {
      key: "designation",
      name: "Chỉ định",
      minWidth: 120,
      maxWidth: 250,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.designation)}</span>;
      },
    },
    {
      key: "usage",
      name: "Hướng dẫn sử dụng",
      minWidth: 150,
      maxWidth: 250,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.usage)}</span>;
      },
    },
    {
      key: "price",
      name: "Đơn giá",
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(`${item.price} vnđ`)}</span>;
      },
    },
  ];

  const integrateItems = (reqbody: any): Promise<AxiosResponse<any, any>> => {
    const body = {
      ...reqbody,
    };
    return medicationApi.getAll(body);
  };

  const commandBar = () => {
    const command: ICommandBarItemProps[] = [];
    if (role === Role.admin) {
      command.push({
        key: "newItem",
        text: "Thêm mới thuốc",
        iconProps: { iconName: "Add" },
        onClick: () => { 
          setEdit(false); 
          setOpen(true);
          setValues({})
        },
      });
      if (tableSelectedCount > 0) {
        command.push({
          key: "editItem",
          text: "Sửa",
          iconProps: { iconName: "Edit" },
          onClick: () => { 
            setEdit(true); 
            setOpen(true);
            setValues({
              displayName: tableSelectedItem[0]?.displayName,
              designation: tableSelectedItem[0]?.designation,
              usage: tableSelectedItem[0]?.usage,
              price: tableSelectedItem[0]?.price
            })
          },
        });
      }
    }
    command.push({
      key: "export",
      text: "Xuất file",
      iconProps: { iconName: "Installation" },
      onClick: () => alert("Xuất file excel"),
    });
    return command;
  };

  const onClosePanel = () => {
    setOpen(false)
  }

  const onFinishFailed = (_: any) => {
    dispatch(
      showToastMessage({
        message: "Hãy điền các trường còn trống",
        type: toastType.error,
      })
    );
  };

  const onFinish = (values: any) => {
    let api = medicationApi.createlMedications;
    let body;
    if (isEdit) {
      api = medicationApi.updateMedications;
      body = {
        ...values,
        id: tableSelectedItem[0]?._id
      }
    } else {
      body = values;
    }
    dispatch(openLoading());
    api(body)
      .then((result: any) => {
        if (result.isSuccess) {
          dispatch(
            showToastMessage({
              message: "Thành công",
              type: toastType.succes,
            })
          );
        } else {
          showToastMessage({
            message: "Có lỗi, hãy thử lại",
            type: toastType.error,
          })
        }
        onClosePanel();
        dispatch(tableRefresh());
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

  const checkPrice = (_: any, value: any) => {
    if (value > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Giá tiền phải là số lớn hơn 0!'));
  }

  useEffect(() => {
    form.resetFields();
  }, [values])

  const renderPanel = () => {
    return (
      <Form
          id="medication-form"
          form={form}
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          layout={"vertical"}
          style={{ maxWidth: 800 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          validateMessages={{
            required: 'Hãy nhập ${label}!',
            types: {
              number: '${label} phải là số!',
            }
          }}
          initialValues={values}
        >
          <div>
            <Col span={24} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Tên thuốc"
                name="displayName"
                rules={[{ required: true }]}
              >
                <Input.TextArea size="middle" />
              </Form.Item>
            </Col>
            <Col span={24} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Chỉ định"
                name="designation"
                rules={[{ required: true }]}
              >
                <Input.TextArea style={{ height: 120 }} />
              </Form.Item>
            </Col>
            <Col span={24} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Hướng dẫn sử dụng"
                name="usage"
                rules={[{ required: true }]}
              >
                <Input.TextArea style={{ height: 120 }} />
              </Form.Item>
            </Col>
            <Col 
              span={24} 
              style={{ 
                  display: "flex", 
                  flex: 1, 
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center"
                }
              }>
              <Col span={18}>
                <Form.Item<FieldType>
                  label="Giá tiền"
                  name="price"
                  rules={[{ required: true, validator: checkPrice }]}
                >
                <Input />
              </Form.Item>
              </Col>
              <Col span={5}>
                <span style={{ fontSize: 16 }}>VNĐ</span>
              </Col>
          </Col>
          </div>
          <div>
            <Form.Item className="button">
              <Button onClick={onClosePanel}>Hủy</Button>
              <Button htmlType="submit" type="primary" style={{ marginLeft: 12 }}>
                {!isEdit ? "Thêm" : "Cập nhật"}
              </Button>
            </Form.Item>
          </div>
      </Form>
    )
  }
  
  return (
    <>
      <UniformTable
          columns={Column}
          commandBarItems={commandBar()}
          integrateItems={integrateItems}
          searchByColumn={"displayName"}
          searchPlaceholder={"tên thuốc"}
          noSelected
      />
      <Drawer
        title="Thêm thuốc mới"
        width={480}
        closable={false}
        destroyOnClose={true}
        onClose={onClosePanel}
        maskClosable={false}
        open={isOpen}
      >{renderPanel()}</Drawer>
    </>
  );
}

export default Medications;