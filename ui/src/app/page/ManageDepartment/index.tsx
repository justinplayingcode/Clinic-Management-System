import { AxiosResponse } from "axios";
import { UniformTable } from "../../common";
import { departmentApi } from "../../../api";

function ManageDepartment() {


  const departmentColumn = [
    {
        key: 'name',
        name: 'Name',
        minWidth: 210,
        maxWidth: 350,
        isResizable: true,
        onRender: (item: any) => {
            return <span>{item.name}</span>;
        },
    },
    {
        key: 'code',
        name: 'Code',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        onRender: (item: any) => {
            return <span>{item.code}</span>;
        },
    },
  ];

  const integrateItems = (reqbody: any): Promise<AxiosResponse<any, any>> => {
    const body = {
      ...reqbody,
    };
    return departmentApi.manageDepartment(body);
  }

  return (  
    <UniformTable 
      columns={departmentColumn} 
      commandBarItems={[]} 
      integrateItems={integrateItems}
      searchByColumn={"displayName"}      
    />
  );
}

export default ManageDepartment;