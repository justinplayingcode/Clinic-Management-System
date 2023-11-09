import { Utils } from "../../../utils";

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