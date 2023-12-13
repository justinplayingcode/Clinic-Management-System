import { AxiosResponse } from "axios";
import UniformTable from "../components/table"
import { authApi, userApi } from "../../../api";
import { ICommandBarItemProps } from "@fluentui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { tooltipPlainText } from "../../../utils/basicRender";
import { Utils } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Avatar, Button, Flex, Modal } from "antd";
import "./index.scss";
import { useDispatch } from "react-redux";
import { closeLoading, openLoading, showToastMessage } from "../../../redux/reducers";
import { toastType } from "../../model/enum/common";

function ManageUser() {
  const { tableSelectedCount, tableSelectedItem } = useSelector((state: RootState) => state.currentSeleted);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openResetPW, setOpenResetPW] = useState<boolean>(false)

  const column = [
    {
      key: 'name',
      name: 'Họ và tên',
      minWidth: 80,
      maxWidth: 180,
      isResizable: true,
      onRender: (item: any) => {
          return <div style={{display: "flex", alignItems: "center"}}>
          <Avatar shape="square" size="small" src={item.avatar} style={{ marginRight: '6px'}} />
          <span>{tooltipPlainText(item.fullName)}</span>
        </div>
      },
    },
    {
      key: 'gender',
      name: 'Giới tính',
      minWidth: 60,
      maxWidth: 80,
      isResizable: true,
      onRender: (item: any) => {
          return <span>{Utils.getGenderText(item.gender)}</span>;
      },
  },
    {
      key: 'dob',
      name: 'Ngày sinh',
      minWidth: 80,
      maxWidth: 180,
      isResizable: true,
      onRender: (item: any) => {
          return <span>{tooltipPlainText(item.dateOfBirth)}</span>;
      },
    },
    {
      key: 'phoneNumber',
      name: 'Số điện thoại',
      minWidth: 80,
      maxWidth: 150,
      isResizable: true,
      onRender: (item: any) => {
          return <span>{tooltipPlainText(item.phoneNumber)}</span>;
      },
    },
    {
      key: 'address',
      name: 'Địa chỉ',
      minWidth: 150,
      maxWidth: 300,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.address)}</span>;
      },
    },
    {
      key: 'email',
      name: 'Email',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => {
          return <span>{tooltipPlainText(item.email)}</span>;
      },
    },
  ];

  const commandBar = () => {
    const command: ICommandBarItemProps[] = [];
    if(tableSelectedCount === 1){
      command.push({
          key: 'edit',
          text: 'Thông tin tài khoản',
          iconProps: { iconName: 'ContactInfo' },
          onClick: () => { navigate(`/manageaccount/user/detail/${tableSelectedItem[0]?._id}`) },
      }, {
        key: 'resetpw',
        text: 'Đặt lại mật khẩu',
        iconProps: { iconName: 'Signin' },
        onClick: () => setOpenResetPW(true),
      })
    };
    return command;
  }

  const onResetPassword = () => {
    dispatch(openLoading());
    authApi.resetpassword({ id: tableSelectedItem[0]?.accountId })
      .then((result: any) => {
        if (result.isSuccess) {
          dispatch(
            showToastMessage({
              message: "Đặt lại mật khẩu thành công, mật khẩu đặt lại: 1234567",
              type: toastType.succes,
            })
          );
          setOpenResetPW(false);
        } else {
          showToastMessage({
            message: "Có lỗi, hãy thử lại",
            type: toastType.error,
          })
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
  }

  const integrateItems = (reqbody: any): Promise<AxiosResponse<any, any>> => {
    const body = {
      ...reqbody,
    };
    return userApi.manageUser(body);
  }

  const renderResetPWModal = (): JSX.Element => {
    return (
      <div className="modal-reset-pw">
        <div className="modal-reset-pw-title">
          Đặt lại mật khẩu cho tài khoản <span>{`${tableSelectedItem[0]?.phoneNumber}`}</span>
        </div>
        <Flex gap="small" wrap="wrap" className="modal-reset-pw-button" justify="end">
          <Button type="primary" onClick={onResetPassword}>Xác nhận</Button>
          <Button onClick={() => setOpenResetPW(false)}>Hủy</Button>
        </Flex>
      </div>
    )
  }

  return (  
    <>
    <UniformTable 
      columns={column} 
      commandBarItems={commandBar()} 
      integrateItems={integrateItems}
      searchByColumn={"fullName"}
      searchPlaceholder="tên"
    />
    <Modal
      centered
      title="Xác nhận"
      width={400}
      open={openResetPW}
      onOk={() => setOpenResetPW(false)}
      onCancel={() => setOpenResetPW(false)}
      closable={true}
      keyboard={false}
      maskClosable={false}
      footer={() => <></>}
    >
      {renderResetPWModal()}
    </Modal>
    </>
  );
}

export default ManageUser;