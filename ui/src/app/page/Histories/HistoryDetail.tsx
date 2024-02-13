import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  closeLoading,
  openLoading,
  showToastMessage,
} from "../../../redux/reducers";
import { scheduleApi } from "../../../api";
import {
  AppointmentStatus,
  Gender,
  PositionOfDoctor,
  RankOfDoctor,
  TimeFrame,
  toastType,
} from "../../model/enum/common";
import { Col, Descriptions } from "antd";
import { Utils } from "../../../utils";
import "./HistoryDetails.scss";

interface IHistoryDetails {
  _id: string;
  appointmentDate: string;
  appointmentTime: TimeFrame;
  appointmentReason: string;
  status: AppointmentStatus;
  doctorId: string;
  departmentName: string;
  typeAppointment: string;
  typeAppointmentPrice: number;
  patient: {
    _id: string;
    fullName: string;
    dateOfBirth: string;
    address: string;
    phoneNumber: string;
    insurance: string;
    gender: string;
    guardianName: string;
    guardianPhoneNumber: string;
    guardianRelationship: string;
  };
  doctor: {
    rank: RankOfDoctor;
    position: PositionOfDoctor;
    departmentName: string;
    departmentId: string;
    accountId: string;
    userId: string;
    email: string;
    avatar: string;
    fullName: string;
    gender: Gender;
    address: string;
    dateOfBirth: string;
    phoneNumber: string;
  };
  medicalRecord: {
    summary: string;
    diagnosis: string;
    healthIndicator: {
      height: string;
      weight: string;
      heartRate: string;
      bloodPressure: string;
      temperature: string;
      glucose: string;
    };
    serviceResult: {
      id: string;
      name: string;
      price: number;
      note: string;
    }[];
  };
  prescription: {
    medications: {
      displayName: string;
      text: string;
      secondaryText: string;
      id: string;
      usage: string;
      price: number;
    }[];
    note: string;
  };
  bill: {
    cost: number;
    dateCreated: string;
  };
}

function HistoryDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [item, setItem] = useState<IHistoryDetails>();

  useEffect(() => {
    dispatch(openLoading());
    scheduleApi
      .getDetail(id)
      .then((result: any) => {
        if (result.isSuccess) {
          setItem(result.data);
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
  }, []);

  const renderIndicatorList = (item: IHistoryDetails | undefined) => {
    return (
      <>
        <Col>{`Chiều cao: ${item?.medicalRecord.healthIndicator.height}cm`}</Col>
        <Col>{`Cân nặng: ${item?.medicalRecord.healthIndicator.weight}kg`}</Col>
        <Col>
          {`Nhịp tim: ${item?.medicalRecord.healthIndicator.heartRate}bpm`}
        </Col>
        <Col>
          {`Huyết áp: ${item?.medicalRecord.healthIndicator.bloodPressure}mmHg`}
        </Col>
        <Col>
          {`Nhiệt độ: ${item?.medicalRecord.healthIndicator.temperature}`}
          &#8451;
        </Col>
        <Col>
          {`Đường huyết: ${item?.medicalRecord.healthIndicator.glucose}`}
        </Col>
      </>
    );
  };

  const renderServiceList = (item: IHistoryDetails | undefined) => {
    return (
      <>
        {item?.medicalRecord.serviceResult.map((ser) => (
          <Col>{`${ser.name}: ${ser.price.toLocaleString()} VNĐ`}</Col>
        ))}
      </>
    );
  };

  const renderMedicationList = (item: IHistoryDetails | undefined) => {
    const list = item?.prescription.medications.map((pre) => `${pre.displayName} - giá tiền: ${pre.price.toLocaleString()} VNĐ`);
    return (list || []).join(",");
  };

  return (
    <Col className="history-detail-container">
      <Col className="info-section">
        {/* patient info */}
        <Descriptions bordered title="Thông tin bệnh nhân" column={1}>
          <Descriptions.Item label="Họ và tên " labelStyle={{ width: "200px" }}>
            {item?.patient.fullName || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh" labelStyle={{ width: "200px" }}>
            {Utils.convertDatetoddmmyyyy(item?.patient.dateOfBirth)}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính" labelStyle={{ width: "200px" }}>
            {Utils.getGenderText(Number(item?.patient.gender))}
          </Descriptions.Item>
          <Descriptions.Item label="Bảo hiểm " labelStyle={{ width: "200px" }}>
            {item?.patient.insurance || "-"}
          </Descriptions.Item>
          <Descriptions.Item
            label="Số điện thoại "
            labelStyle={{ width: "200px" }}
          >
            {item?.patient.phoneNumber || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ " labelStyle={{ width: "200px" }}>
            {item?.patient.address || "-"}
          </Descriptions.Item>
          {item?.patient.guardianName && (
            <>
              <Descriptions.Item
                label="Người giám hộ "
                labelStyle={{ width: "200px" }}
              >
                {item?.patient.guardianName || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="Số điện thoại người giám hộ "
                labelStyle={{ width: "200px" }}
              >
                {item?.patient.guardianPhoneNumber || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="Quan hệ"
                labelStyle={{ width: "200px" }}
              >
                {Utils.getPatientRelationshipText(
                  Number(item?.patient.guardianRelationship)
                ) || "-"}
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
      </Col>

      {/* doctor info */}
      <Col className="info-section">
        <Descriptions bordered title="Thông tin bác sĩ" column={1}>
          <Descriptions.Item label="Họ và tên " labelStyle={{ width: "200px" }}>
            {item?.doctor.fullName || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh" labelStyle={{ width: "200px" }}>
            {item?.doctor.dateOfBirth || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính" labelStyle={{ width: "200px" }}>
            {Utils.getGenderText(Number(item?.doctor.gender))}
          </Descriptions.Item>
          <Descriptions.Item label="Khoa" labelStyle={{ width: "200px" }}>
            {item?.doctor.departmentName || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Chức vụ" labelStyle={{ width: "200px" }}>
            {Utils.getDoctorPositionText(item?.doctor.position)}
          </Descriptions.Item>
          <Descriptions.Item label="Học vấn" labelStyle={{ width: "200px" }}>
            {Utils.getDoctorRankText(item?.doctor.rank)}
          </Descriptions.Item>
          <Descriptions.Item
            label="Số điện thoại"
            labelStyle={{ width: "200px" }}
          >
            {item?.doctor.phoneNumber}
          </Descriptions.Item>
        </Descriptions>
      </Col>

      {/* main info */}
      <Col className="info-section">
        <Descriptions bordered title="Thông tin khám bệnh" column={1}>
          <Descriptions.Item label="Ngày khám " labelStyle={{ width: "200px" }}>
            {item?.appointmentDate || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Loại " labelStyle={{ width: "200px" }}>
            {item?.typeAppointment || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Giá tiền " labelStyle={{ width: "200px" }}>
            {item?.typeAppointmentPrice.toLocaleString() || "-"} VNĐ
          </Descriptions.Item>
          <Descriptions.Item label="Lý do khám" labelStyle={{ width: "200px" }}>
            {item?.appointmentReason || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Chỉ số" labelStyle={{ width: "200px" }}>
            {renderIndicatorList(item)}
          </Descriptions.Item>
          <Descriptions.Item
            label="Dịch vụ khám"
            labelStyle={{ width: "200px" }}
          >
            {renderServiceList(item)}
          </Descriptions.Item>
          <Descriptions.Item label="Chẩn đoán" labelStyle={{ width: "200px" }}>
            {item?.medicalRecord.diagnosis || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Kết luận" labelStyle={{ width: "200px" }}>
            {item?.medicalRecord.summary || "-"}
          </Descriptions.Item>
        </Descriptions>
      </Col>

      {/* medications info */}
      <Col className="info-section">
        <Descriptions bordered title="Đơn thuốc" column={1}>
          <Descriptions.Item label="Thuốc" labelStyle={{ width: "200px" }}>
            {renderMedicationList(item)}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú" labelStyle={{ width: "200px" }}>
            {item?.prescription.note}
          </Descriptions.Item>
        </Descriptions>
      </Col>

      {/* Bill info */}
      <Col className="info-section">
        <Descriptions bordered title="Hóa đơn" column={1}>
          <Descriptions.Item label="Giá tiền " labelStyle={{ width: "200px" }}>
            {item?.bill.cost.toLocaleString() || "-"} VNĐ {`(Đã trừ đi chi phí được giảm nếu có)`}
          </Descriptions.Item>
          <Descriptions.Item
            label="Ngày thanh toán"
            labelStyle={{ width: "200px" }}
          >
            {item?.bill.dateCreated || "-"}
          </Descriptions.Item>
        </Descriptions>
      </Col>
    </Col>
  );
}

export default HistoryDetail;
