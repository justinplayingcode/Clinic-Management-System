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
import { Col, Descriptions, Typography } from "antd";
import { Utils } from "../../../utils";
import "./HistoryDetails.scss";
const { Text } = Typography;

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
          <Col>{`${ser.name}: ${ser.price}`}</Col>
        ))}
      </>
    );
  };

  const renderMedicationList = (item: IHistoryDetails | undefined) => {
    const list = item?.prescription.medications.map((pre) => pre.displayName);
    return (list || []).join(",");
  };

  return (
    <Col className="history-detail-container">
      <Text strong>Lịch sử khám</Text>
      <Col className="info-section">
        {/* patient info */}
        <Descriptions bordered title="Thông tin bệnh nhân" column={1}>
          <Descriptions.Item label="Họ và tên ">
            {item?.patient.fullName || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {Utils.convertDatetoddmmyyyy(item?.patient.dateOfBirth)}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {Utils.getGenderText(Number(item?.patient.gender))}
          </Descriptions.Item>
          <Descriptions.Item label="Bảo hiểm ">
            {item?.patient.insurance || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại ">
            {item?.patient.phoneNumber || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ ">
            {item?.patient.address || "-"}
          </Descriptions.Item>
          {item?.patient.guardianName && (
            <>
              <Descriptions.Item label="Người giám hộ ">
                {item?.patient.guardianName || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại người giám hộ ">
                {item?.patient.guardianPhoneNumber || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Quan hệ">
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
          <Descriptions.Item label="Họ và tên ">
            {item?.doctor.fullName || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {item?.doctor.dateOfBirth || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {Utils.getGenderText(Number(item?.doctor.gender))}
          </Descriptions.Item>
          <Descriptions.Item label="Khoa">
            {item?.doctor.departmentName || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Chức vụ">
            {Utils.getDoctorPositionText(item?.doctor.position)}
          </Descriptions.Item>
          <Descriptions.Item label="Học vấn">
            {Utils.getDoctorRankText(item?.doctor.rank)}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {item?.doctor.phoneNumber}
          </Descriptions.Item>
        </Descriptions>
      </Col>

      {/* main info */}
      <Col className="info-section">
        <Descriptions bordered title="Thông tin khám bệnh" column={1}>
          <Descriptions.Item label="Ngày khám ">
            {item?.appointmentDate || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Lý do khám">
            {item?.appointmentReason || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Chỉ số">
            {renderIndicatorList(item)}
          </Descriptions.Item>
          <Descriptions.Item label="Dịch vụ khám">
            {renderServiceList(item)}
          </Descriptions.Item>
          <Descriptions.Item label="Chẩn đoán">
            {item?.medicalRecord.diagnosis || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Kết luận">
            {item?.medicalRecord.summary || "-"}
          </Descriptions.Item>
        </Descriptions>
      </Col>

      {/* medications info */}
      <Col className="info-section">
        <Descriptions bordered title="Đơn thuốc" column={1}>
          <Descriptions.Item label="Thuốc">
            {renderMedicationList(item)}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">
            {item?.prescription.note}
          </Descriptions.Item>
        </Descriptions>
      </Col>

      {/* Bill info */}
      <Col className="info-section">
        <Descriptions bordered title="Hóa đơn" column={1}>
          <Descriptions.Item label="Giá tiền ">
            {item?.bill.cost || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày thanh toán">
            {item?.bill.dateCreated || "-"}
          </Descriptions.Item>
        </Descriptions>
      </Col>
    </Col>
  );
}

export default HistoryDetail;
