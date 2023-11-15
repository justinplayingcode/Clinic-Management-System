import { AxiosResponse } from "axios";
import UniformTable from "../components/table";
import { userApi } from "../../../api";
import CreateDoctor from "./components/CreateDoctor/CreateDoctor";
import { useState } from "react";
import { tooltipPlainText } from "../../../utils/basicRender";
import { Utils } from "../../../utils";
import { ICommandBarItemProps } from "@fluentui/react";
import { RootState } from "../../../redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ManageDoctor() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const { tableSelectedCount, tableSelectedItem } = useSelector(
    (state: RootState) => state.currentSeleted
  );
  const navigate = useNavigate();

  const departmentColumn = [
    {
      key: "name",
      name: "Họ và tên",
      minWidth: 80,
      maxWidth: 180,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.fullName)}</span>;
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
        onClick: () => { navigate(`/manageaccount/doctor/detail/${tableSelectedItem[0]?.userId}`) },
      });
    }
    command.push({
      key: "export",
      text: "Xuất file",
      iconProps: { iconName: "Installation" },
      onClick: () => alert("Xuất file excel"),
    });
    return command;
  };

  return (
    <>
      <UniformTable
        columns={departmentColumn}
        commandBarItems={commandBar()}
        integrateItems={integrateItems}
        searchByColumn={"fullName"}
        searchPlaceholder={"tên"}
      />
      <CreateDoctor isOpen={isOpen} dismissForm={() => setOpen(false)} />
    </>
  );
}

export default ManageDoctor;
