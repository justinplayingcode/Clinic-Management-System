import { AxiosResponse } from "axios";
import UniformTable from "../components/table";
import { ICommandBarItemProps } from "@fluentui/react";
import { useState } from "react";
import { tooltipPlainText } from "../../../utils/basicRender";
import { medicationApi } from "../../../api";
import { Button, Drawer, Flex } from "antd";

function Medications() {
  const [isOpen, setOpen] = useState<boolean>(false);

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
      name: "Mô tả",
      minWidth: 120,
      maxWidth: 250,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.designation)}</span>;
      },
    },
    {
      key: "usage",
      name: "Cách dùng",
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
    command.push({
      key: "newItem",
      text: "Thêm mới thuốc",
      iconProps: { iconName: "Add" },
      onClick: () => setOpen(true),
    });
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

  const onAddMedication = () => {
    setOpen(false)
  }

  const renderPanel = () => {
    return (
      <>thêm thuốc</>
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
      />
      <Drawer
        title="Thêm thuốc mới"
        width={480}
        closable={false}
        onClose={onClosePanel}
        open={isOpen}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        footer={
          <Flex justify="end">
            <Button onClick={onClosePanel}>Hủy</Button>
            <Button onClick={onAddMedication} type="primary" style={{ marginLeft: 8 }}>
              Thêm
            </Button>
          </Flex>
        }
      >{renderPanel()}</Drawer>
    </>
  );
}

export default Medications;