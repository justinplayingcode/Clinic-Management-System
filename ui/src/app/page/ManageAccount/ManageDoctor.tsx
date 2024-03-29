import { AxiosResponse } from "axios";
import UniformTable from "../components/table";
import { userApi } from "../../../api";
import CreateDoctor from "./components/CreateDoctor/CreateDoctor";
import { useState } from "react";
import { tooltipPlainText } from "../../../utils/basicRender";
import { Utils } from "../../../utils";
import { ICommandBarItemProps } from "@fluentui/react";
import { RootState } from "../../../redux";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Flex, Modal } from "antd";
import { closeLoading, openLoading, showToastMessage, tableRefresh } from "../../../redux/reducers";
import { toastType } from "../../model/enum/common";

const column = [
  {
    key: "name",
    name: "Họ và tên",
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
    key: "departmentName",
    name: "Khoa",
    minWidth: 80,
    maxWidth: 150,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.departmentName)}</span>;
    },
  },
  {
    key: "rank",
    name: "Học vấn",
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{Utils.getDoctorRankText(item.rank)}</span>;
    },
  },
  {
    key: "position",
    name: "Vai trò",
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{Utils.getDoctorPositionText(item.position)}</span>;
    },
  },
  {
    key: "phoneNumber",
    name: "Số điện thoại",
    minWidth: 80,
    maxWidth: 150,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.phoneNumber)}</span>;
    },
  },
  {
    key: "email",
    name: "Email",
    minWidth: 100,
    maxWidth: 160,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.email)}</span>;
    },
  },
  {
    key: "gender",
    name: "Giới tính",
    minWidth: 80,
    maxWidth: 150,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{Utils.getGenderText(item.gender)}</span>;
    },
  },
  {
    key: "dob",
    name: "Ngày sinh",
    minWidth: 80,
    maxWidth: 150,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.dateOfBirth)}</span>;
    },
  },
  {
    key: "address",
    name: "Địa chỉ",
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.address)}</span>;
    },
  },
];

function ManageDoctor() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [openDeleted, setOpenDeleted] = useState<boolean>(false)
  const dispatch = useDispatch();
  const { tableSelectedCount, tableSelectedItem } = useSelector(
    (state: RootState) => state.currentSeleted
  );
  const navigate = useNavigate();
  const integrateItems = (reqbody: any): Promise<AxiosResponse<any, any>> => {
    const body = {
      ...reqbody,
    };
    return userApi.manageDoctor(body);
  };

  const commandBar = () => {
    const command: ICommandBarItemProps[] = [];
    command.push({
      key: "newItem",
      text: "Thêm mới tài khoản",
      iconProps: { iconName: "Add" },
      onClick: () => setOpen(true),
    });
    if (tableSelectedCount === 1) {
      command.push({
        key: "edit",
        text: "Thông tin bác sĩ",
        iconProps: { iconName: "ContactInfo" },
        onClick: () => { navigate(`/manageaccount/doctor/detail/${tableSelectedItem[0]?.doctorId}`) },
      }, {
        key: "deletedoctor",
        text: "Xóa bác sĩ",
        iconProps: { iconName: "Delete" },
        onClick: () => setOpenDeleted(true),
      });
    }
    return command;
  };

  const onDeletedDoctor = () => {
    dispatch(openLoading());
    userApi.deleteDoctor({ accountId: tableSelectedItem[0]?.accountId })
    .then((result: any) => {
      if (result.isSuccess) {
        dispatch(
          showToastMessage({
            message: "Xóa tài khoản bác sĩ thành công",
            type: toastType.succes,
          })
        );
        setOpenDeleted(false);
        dispatch(tableRefresh());
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

  const renderDeletedModel = (): JSX.Element => {
    return (
      <div className="modal-reset-pw">
        <div className="modal-reset-pw-title">
          Xóa bác sĩ: <span>{`${tableSelectedItem[0]?.fullName}`}</span>, <span>{`${tableSelectedItem[0]?.departmentName}`}</span>
        </div>
        <Flex gap="small" wrap="wrap" className="modal-reset-pw-button" justify="end">
          <Button type="primary" onClick={onDeletedDoctor}>Xác nhận</Button>
          <Button onClick={() => setOpenDeleted(false)}>Hủy</Button>
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
        searchPlaceholder={"tên"}
      />
      <CreateDoctor isOpen={isOpen} dismissForm={() => setOpen(false)} />
      <Modal
        centered
        // title="Bạn có muốn xóa tài khoản bác sĩ"
        width={400}
        open={openDeleted}
        onOk={() => setOpenDeleted(false)}
        onCancel={() => setOpenDeleted(false)}
        closable={true}
        keyboard={false}
        maskClosable={false}
        footer={() => <></>}
      >
        {renderDeletedModel()}
      </Modal>
    </>
  );
}

export default ManageDoctor;