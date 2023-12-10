import { Role } from "../app/model/enum/auth";
import { Gender, PositionOfDoctor, RankOfDoctor, patientRelationship } from "../app/model/enum/common";

export default class Utils {
  public static convertDDmmyyyTommDDyyyy = (value: string): string => {
    if (!value) return "";
    const arr = value.split("/");
    return `${arr[1]}/${arr[0]}/${arr[2]}`
  }

  public static convertmmDDyyyyToDDmmyyyy = (value: string) => {
    if (!value) return "";
    const datearray = value.split("/");
    const newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
    return newdate
  }

  public static deepCopy = (object: any) => {
    try {
      return Object.assign({}, object)
    } catch {
      return JSON.parse(JSON.stringify(object))
    }
  }

  public static getGenderText = (gender: Gender) => {
    switch (gender) {
      case Gender.Male:
        return "Nam";
      case Gender.Female:
        return "Nữ"  ;
      default:
        return "-";
    }
  };

  public static renderAccountRole = (role: Role | null) => {
    switch (role) {
      case Role.admin:
        return "Quản trị viên";
      case Role.doctor:
        return "Bác sĩ";
      case Role.user:
        return "Người dùng";
      default:
        return "--";
    }
  };

  public static getDoctorRankText = (rank: RankOfDoctor| undefined) => {
    switch (rank) {
      case RankOfDoctor.thacSi:
        return "Thạc sĩ";
      case RankOfDoctor.tienSi:
        return "Tiến sĩ";
        case RankOfDoctor.PGSTS:
        return "Phó giáo sư Tiến sĩ";
        case RankOfDoctor.GSTS:
        return "Giáo sư Tiến sĩ";
        case RankOfDoctor.none:
        return "Không";
      default:
        return "";
    }
  }

  public static getDoctorPositionText = (position: PositionOfDoctor | undefined) => {
    switch (position) {
      case PositionOfDoctor.dean:
        return "Trưởng khoa";
      case PositionOfDoctor.viceDean:
        return "Phó khoa";
      case PositionOfDoctor.none:
        return "Không";
      default:
        return "";
    }
  }

  public static getPatientRelationshipText = (relationship: patientRelationship | undefined) => {
    switch (relationship) {
      case patientRelationship.wifeHusband:
        return "Vợ - Chồng";
      case patientRelationship.parentChild:
        return "Cha/Mẹ - Con";
      case patientRelationship.grandParentChild:
        return "Ông/Bà - Cháu";
      case patientRelationship.other:
        return "Khác";
      default:
        return "";
    }
  }

  public static convertUserNameIconText = (string: string) => {
    const str = string || "- -";
    const listString = str.split(" ");
    const sec = listString?.pop()![0] || "";
    const fir = listString?.pop()![0]  || "";
    return fir + sec;
  }

  public static convertDatetoddmmyyyy = (input: string | undefined) => {
    var date = new Date(input || "");
 return  date.getDate()+ '/' + (date.getMonth() + 1) + '/' +  date.getFullYear();
  }
}