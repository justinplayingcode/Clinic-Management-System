import { ICommandBarItemProps } from "@fluentui/react";
import { scheduleApi } from "../../../api";
import { renderAppointmentStatus, renderTimeFrame, tooltipPlainText } from "../../../utils/basicRender";
import UniformTable from "../components/table";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { useNavigate } from "react-router-dom";
import { routerString } from "../../model/router";

function Histories() {
  const Column = [
    {
      key: "appointmentDate",
      name: "Ngày khám",
      minWidth: 80,
      maxWidth: 120,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.appointmentDate)}</span>;
      },
    },
    {
      key: "departmentName",
      name: "Khoa",
      minWidth: 80,
      maxWidth: 120,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.departmentName)}</span>;
      },
    },
    {
      key: "typeAppointment",
      name: "Loại khám",
      minWidth: 80,
      maxWidth: 120,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.typeAppointment)}</span>;
      },
    },
    {
      key: "appointmentReason",
      name: "Triệu chứng",
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.appointmentReason)}</span>;
      },
    },
    {
      key: "appointmentTime",
      name: "Thời gian khám",
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{renderTimeFrame(item.appointmentTime)}</span>;
      },
    },
    {
      key: "status",
      name: "Trạng thái",
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{renderAppointmentStatus(item.status)}</span>;
      },
    },
  ];
  const navigate = useNavigate();
  const { tableSelectedCount, tableSelectedItem } = useSelector(
    (state: RootState) => state.currentSeleted
  );

  const commandBar = () => {
    const command: ICommandBarItemProps[] = [];
    if (tableSelectedCount === 1) {
      command.push({
        key: "detail",
        text: "Thông tin chi tiết",
        iconProps: { iconName: "ContactInfo" },
        onClick: () => { navigate(`${routerString.historiesdetail}/${tableSelectedItem[0]?._id}`) },
      });
    }
    return command
  }

  return (
    <UniformTable
        columns={Column}
        commandBarItems={commandBar()}
        integrateItems={scheduleApi.getComplete}
        searchByColumn={"displayName"}
        searchPlaceholder={""}
        noSearch
    />
  );
}

export default Histories;