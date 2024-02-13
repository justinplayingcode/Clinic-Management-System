import { TooltipHost, TooltipOverflowMode } from "@fluentui/react"
import { AppointmentStatus, TimeFrame } from "../app/model/enum/common";
import { Tag } from "antd";

export const tooltipPlainText = (content: string, extraClassName?: string, id?: string) => {
  if (!content) {
    return <div>--</div>
  }
  return (
    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      <TooltipHost
        content={content}
        closeDelay={200}
        overflowMode={TooltipOverflowMode.Parent}
        hostClassName={extraClassName}
      >
        <span id={id}>{content}</span>
      </TooltipHost>
    </div>
  )
}

export const TimeFrameString = {
  [TimeFrame.from8AMto9AM]: "8h - 9h",
  [TimeFrame.from9AMto10AM]: "9h - 10h",
  [TimeFrame.from10AMto11AM]: "10h - 11h",
  [TimeFrame.from1PMto2PM]: "13h - 14h",
  [TimeFrame.from2PMto3PM]: "14h - 15h",
  [TimeFrame.from3PMto4PM]: "15h - 16h",
  [TimeFrame.from4PMto5PM]: "16h - 17h"
}

export const renderTimeFrame = (value: TimeFrame) => {
  return TimeFrameString[value];
};

export const renderAppointmentStatus = (status: AppointmentStatus) => {
  switch (status) {
    case AppointmentStatus.Checking:
      return <Tag color="gold">Chờ duyệt</Tag>
    case AppointmentStatus.CheckedAndWaitConfirm:
      return <Tag color="orange">Đã duyệt, chờ xác nhận</Tag>
    case AppointmentStatus.Confirmed:
      return <Tag color="blue">Đã xác nhận</Tag>
    case AppointmentStatus.Cancel:
      return <Tag color="red">Hủy</Tag>;
    case AppointmentStatus.Complete:
      return <Tag color="green">Hoàn thành</Tag>
    default:
      return <></>;
  }
};