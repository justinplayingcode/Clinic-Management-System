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

export const renderTimeFrame = (value: TimeFrame) => {
  switch (value) {
    case TimeFrame.Morning:
      return <>7h30 - 11h30</>;
    case TimeFrame.Afternoon:
      return <>14h-16h</>;
    default:
      return <></>;
  }
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