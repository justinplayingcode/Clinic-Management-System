import { Button, Col, Form, FormInstance, Input } from "antd";
import { useDispatch } from "react-redux";
import { closeLoading, openLoading, showToastMessage } from "../../redux/reducers";
import { authApi } from "../../api";
import { toastType } from "../model/enum/common";

interface IChangePasswordProps {
  onCloes: () => void;
  form: FormInstance<any>;
}

type FieldType = {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
}

function ChangePassword(props: IChangePasswordProps) {
  const dispatch = useDispatch();

  const onFinish = (values: any) => {
    dispatch(openLoading());
    const body = {
      newPassword: values.newPassword,
      password: values.password
    }
    authApi.changepassword(body)
      .then((result: any) => {
        if (result.isSuccess) {
          dispatch(
            showToastMessage({
              message: result.message,
              type: toastType.succes,
            })
          );
          props.onCloes();
        } else {
          showToastMessage({
            message: result.message,
            type: toastType.error,
          })
        }
      })
      .catch((error) => {
        dispatch(
          showToastMessage({
            message: error.message,
            type: toastType.error,
          })
        );
      })
      .finally(() => {
        dispatch(closeLoading());
      });
  };

  return (  
    <Form
      id="changepw-form"
      form={props.form}
      name="changepw-form"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      layout={"vertical"}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <div>
        <Col span={24} style={{ flex: 1 }}>
          <Form.Item<FieldType>
            label="Mật khẩu cũ"
            name="password"
            rules={[{ required: true, message: "Hãy nhập mật khẩu cũ" }]}
          >
            <Input.Password placeholder="Nhập mật khảu cũ" />
          </Form.Item>
        </Col>
        <Col span={24} style={{ flex: 1 }}>
          <Form.Item<FieldType>
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: "Hãy nhập mật khẩu mới" },
              () => ({
                validator(_, value) {
                  if (!value || value.length > 5) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu có độ dài từ 6 kí tự!'));
                },
              })
            ]}
          >
            <Input.Password placeholder="Nhập mật khảu mới"/>
          </Form.Item>
        </Col>
        <Col span={24} style={{ flex: 1 }}>
          <Form.Item<FieldType>
            label="Nhập lại mật khẩu mới"
            name="confirmNewPassword"
            dependencies={['newPassword']}
            rules={[
              {
                required: true, message: "Hãy nhập lại mật khẩu mới"
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu mới không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập mật khảu mới" />
          </Form.Item>
        </Col>
      </div>
      <div>
        <Form.Item className="button">
          <Button onClick={props.onCloes}>Hủy</Button>
          <Button htmlType="submit" type="primary" style={{ marginLeft: 12 }}>
            {"Cập nhật"}
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
}

export default ChangePassword;