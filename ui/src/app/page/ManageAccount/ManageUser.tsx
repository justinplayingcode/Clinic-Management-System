import { AxiosResponse } from "axios";
import UniformTable from "../components/table"
import { userApi } from "../../../api";
import { ICommandBarItemProps } from "@fluentui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { tooltipPlainText } from "../../../utils/basicRender";
import { Utils } from "../../../utils";

function ManageUser() {
  const { tableSelectedCount, tableSelectedItem } = useSelector((state: RootState) => state.currentSeleted);

  const column = [
    {
        key: 'name',
        name: 'Họ và tên',
        minWidth: 80,
        maxWidth: 180,
        isResizable: true,
        onRender: (item: any) => {
            return <span>{tooltipPlainText(item.fullName)}</span>;
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
      minWidth: 70,
      maxWidth: 90,
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
          // onClick: () => { navigate(`/doctor-management/doctor-details/${tableSelectedItem[0]?.userId}`) },
          onClick: () => alert("redirect to detail page")
      })
    };
    command.push({
      key: "export",
      text: "Xuất file",
      iconProps: { iconName: 'Installation' },
      onClick: () => alert("Xuất file excel")
    })
    return command;
  }

  const integrateItems = (reqbody: any): Promise<AxiosResponse<any, any>> => {
    const body = {
      ...reqbody,
    };
    return userApi.manageUser(body);
  }

  return (  
    <UniformTable 
      columns={column} 
      commandBarItems={commandBar()} 
      integrateItems={integrateItems}
      searchByColumn={"fullName"}
      searchPlaceholder="tên"
    />
  );
}

export default ManageUser;