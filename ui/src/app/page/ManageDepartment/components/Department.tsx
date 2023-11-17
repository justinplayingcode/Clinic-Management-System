import {
  EditOutlined,
  PlusOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Empty, Form, Input, Modal, Row } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { departmentApi } from "../../../../api";
import UniformTable from "../../components/table";
import "./Department.scss";

interface ISelectOption {
  value: string;
  label: string;
}

function Department() {
  const [departmentList, setDepartmentList] = useState<ISelectOption[]>([]);
  const [selectItem, setSelectItem] = useState<ISelectOption>();
  const [isOpenAddEit, setAddEit] = useState<{
    open: boolean;
    isEdit: boolean;
  }>({
    open: false,
    isEdit: false,
  });
  const [departmentInputValue, setInputValue] = useState<string>("");

  const callApiDepartment = () => {
    return departmentApi.getDepartmentList().then((response) => {
      const result = response?.data?.map((item: any) => {
        return {
          value: item?._id,
          label: item?.displayName,
        };
      });
      setDepartmentList(result);
    });
  };

  useEffect(() => {
    callApiDepartment();
  }, []);

  const departmentItem = (item: ISelectOption, _: number) => {
    return (
      <Row
        className={`preview-container ${
          selectItem?.value === item.value && "active"
        }`}
        onClick={() => setSelectItem(item)}
      >
        <Col className="preview-avatar">
          <Avatar size="large" icon={<UserOutlined />} />
        </Col>
        <Row className="preview-info">
          <Col>
            <Row className="preview-name">
              <Text strong>{item.label}</Text>
            </Row>
          </Col>

          {selectItem?.value === item.value && (
            <RightOutlined style={{ color: "#00A2FF" }} />
          )}
        </Row>
      </Row>
    );
  };

  const departmentColumn = [
    {
      key: "name",
      name: "Name",
      minWidth: 210,
      maxWidth: 350,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{item.name}</span>;
      },
    },
    {
      key: "code",
      name: "Code",
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
  };

  const renderAppointmentDetails = (item: ISelectOption) => {
    // add logic switch case để trả ra column với api tương ứng
    return (
      <>
        <UniformTable
          columns={departmentColumn}
          commandBarItems={[]}
          integrateItems={integrateItems}
          searchByColumn={"displayName"}
          searchPlaceholder={"tên"}
        />
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
              setInputValue(selectItem.label);
            }}
          >
            Sửa
          </Button>
        )}
        <Button
          icon={<PlusOutlined />}
          style={{ marginLeft: 8}}
          onClick={() => setAddEit({ open: true, isEdit: false })}
        >
          Thêm
        </Button>
      </Row>
    );
  };

  const handleSubmitAddEdit = () => {
    setAddEit({ open: false, isEdit: false });
    // api goes here
    console.log(departmentInputValue);
    setInputValue("");
  };

  const handleCancelAddEdit = () => {
    setAddEit({ open: false, isEdit: false });

    setInputValue("");
  };

  return (
    <>
      <Row className="departmentList-container">
        <Col className="list-section">
          <Row style={{ justifyContent: "space-between" }}>
            <Title level={4}>Danh sách khoa</Title>
            {renderManageButton()}
          </Row>
          <Paragraph>
            Vui lòng chọn một trong các lịch hẹn có sẵn để xem chi tiết
          </Paragraph>
          <Col className="list-container">
            {departmentList.length > 0 ? (
              departmentList.map((item, index) => departmentItem(item, index))
            ) : (
              <Row style={{ justifyContent: "center", marginTop: "80px" }}>
                <Col style={{ flexDirection: "column" }}>
                  <Empty />
                </Col>
              </Row>
            )}
          </Col>
        </Col>
        <Col className="details-section">
          <Col className="top-details">
            <Title level={4}>Danh sách bác sĩ của khoa</Title>
            {!selectItem ? (
              <Row style={{ justifyContent: "center", marginTop: "80px" }}>
                <Col style={{ flexDirection: "column" }}>
                  <Empty
                    description={
                      <Text>Vui lòng chọn một khoa để xem chi tiết.</Text>
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
          onOk={handleSubmitAddEdit}
          onCancel={handleCancelAddEdit}
        >
          <Input
            value={departmentInputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </Modal>
      </Row>
    </>
  );
}

export default Department;
