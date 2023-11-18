import {
  EditOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button, Col, Empty, Input, Modal, Row } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { departmentApi } from "../../../../api";
import UniformTable from "../../components/table";
import "./Department.scss";
import { tooltipPlainText } from "../../../../utils/basicRender";
import { Utils } from "../../../../utils";
import { useDispatch } from "react-redux";
import { closeLoading, openLoading, showToastMessage } from "../../../../redux/reducers";
import { toastType } from "../../../model/enum/common";

interface ISelectOption {
  value: string;
  label: string;
}

const columns = [
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
]

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
  const [errorInputValue, setErrorInputValue] = useState<string>("");

  const dispatch = useDispatch();

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
          {/* <Avatar size="large" icon={<UserOutlined />} /> */}
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

  const integrateItems = (reqbody: any): Promise<AxiosResponse<any, any>> => {
    const body = {
      ...reqbody,
      id: selectItem?.value
    };
    return departmentApi.manageDepartment(body);
  };

  const renderAppointmentDetails = (_: ISelectOption) => {
    // add logic switch case để trả ra column với api tương ứng
    return (
      <UniformTable
        key={JSON.stringify(selectItem?.value)}
        columns={columns}
        commandBarItems={[]}
        integrateItems={integrateItems}
        searchByColumn={"fullName"}
        searchPlaceholder={"tên"}
      />
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
    if (!departmentInputValue) {
      return;
    }
    dispatch(openLoading());
    let api = departmentApi.createDepartment;
    let body: any = { displayName: departmentInputValue };
    if (isOpenAddEit.isEdit) {
      api = departmentApi.updateDepartment;
      body = {
        displayName: departmentInputValue,
        id: selectItem?.value
      }
    }
    api(body).then((result: any) => {
      if (result.isSuccess) {
        dispatch(
          showToastMessage({
            message: "Thành công",
            type: toastType.succes,
          })
        );
        callApiDepartment();
        setInputValue("");
        handleCancelAddEdit();
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
  };

  const handleCancelAddEdit = () => {
    setAddEit({ open: false, isEdit: false });
    setErrorInputValue("");
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
            onChange={(e) => {
              if (e.target.value) {
                setErrorInputValue("")
              } else {
                setErrorInputValue("Vui lòng nhập tên khoa!")
              }
              setInputValue(e.target.value)
            }}
            status={errorInputValue ? "error" : undefined}
          />
          <div style={{ color: "#ff4d4f" }}>{errorInputValue}</div>
        </Modal>
      </Row>
    </>
  );
}

export default Department;
