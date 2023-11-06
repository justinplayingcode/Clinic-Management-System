import { AxiosResponse } from "axios";
import UniformTable from "../components/table"
import { userApi } from "../../../api";

function ManageUser() {
  const departmentColumn = [
    {
        key: 'name',
        name: 'Họ và tên',
        minWidth: 80,
        maxWidth: 180,
        isResizable: true,
        onRender: (item: any) => {
            return <span>{item.fullName}</span>;
        },
    },
    {
        key: 'phoneNumber',
        name: 'Số điện thoại',
        minWidth: 80,
        maxWidth: 150,
        isResizable: true,
        onRender: (item: any) => {
            return <span>{item.phoneNumber}</span>;
        },
    },
    {
      key: 'email',
      name: 'Enail',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => {
          return <span>{item.email}</span>;
      },
    },
    {
      key: 'address',
      name: 'Địa chỉ',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      onRender: (item: any) => {
          return <span>{item.address}</span>;
      },
    },
  ];

  const integrateItems = (reqbody: any): Promise<AxiosResponse<any, any>> => {
    const body = {
      ...reqbody,
    };
    return userApi.manageUser(body);
  }

  return (  
    <UniformTable 
      columns={departmentColumn} 
      commandBarItems={[]} 
      integrateItems={integrateItems}
      searchByColumn={"phoneNumber"}      
    />
  );
}

export default ManageUser;