import { Utils } from "../../../utils";

export const host = "https://provinces.open-api.vn/api/";

export enum toastType {
  succes,
  error,
  info,
  warning
}

export enum ErrorPageEnum {
  Unauthorized,
  Forbidden,
  ServerError
}

export enum Gender {
  Male = 0,
  Female = 1,
}

export const genderList = [
  {
    value: Gender.Male,
    label: "Nam",
  },
  {
    value: Gender.Female,
    label: "Nữ",
  },
];

export enum RankOfDoctor {
  thacSi,
  tienSi,
  PGSTS,
  GSTS,
  none
}

export const RankDoctorList = [
  {
    value: RankOfDoctor.thacSi,
    label: Utils.getDoctorRankText(RankOfDoctor.thacSi)
  },
  {
    value: RankOfDoctor.tienSi,
    label: Utils.getDoctorRankText(RankOfDoctor.tienSi)
  },
  {
    value: RankOfDoctor.PGSTS,
    label: Utils.getDoctorRankText(RankOfDoctor.PGSTS)
  },
  {
    value: RankOfDoctor.GSTS,
    label: Utils.getDoctorRankText(RankOfDoctor.GSTS)
  },
  {
    value: RankOfDoctor.none,
    label: Utils.getDoctorRankText(RankOfDoctor.none)
  },
]

export enum PositionOfDoctor {
  dean,
  viceDean,
  none
}

export const PositionDoctorList = [
  {
    value: PositionOfDoctor.dean,
    label: Utils.getDoctorPositionText(PositionOfDoctor.dean)
  },
  {
    value: PositionOfDoctor.viceDean,
    label: Utils.getDoctorPositionText(PositionOfDoctor.viceDean)
  },
  {
    value: PositionOfDoctor.none,
    label: Utils.getDoctorPositionText(PositionOfDoctor.none)
  },  
]

export enum patientRelationship{
  wifeHusband,
  parentChild,
  grandParentChild,
  other
}

export const patientRelationshipList = [
  {
    value: patientRelationship.wifeHusband,
    label: Utils.getPatientRelationshipText(patientRelationship.wifeHusband)
  },
  {
    value: patientRelationship.parentChild,
    label: Utils.getPatientRelationshipText(patientRelationship.parentChild)
  },
  {
    value: patientRelationship.grandParentChild,
    label: Utils.getPatientRelationshipText(patientRelationship.grandParentChild)
  },  
  {
    value: patientRelationship.other,
    label: Utils.getPatientRelationshipText(patientRelationship.other)
  }
]

export enum TypeService {
  basic,
  other
}

export enum AccountType {
  account,
  doctor
}

export enum ServiceType {
  Basic,
  Other,
}

export enum AppointmentStatus{
  Checking,
  CheckedAndWaitConfirm,
  Confirmed,
  Cancel,
  Complete
}

export enum TimeFrame {
  Morning,
  Afternoon
}