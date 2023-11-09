import { Gender, PositionOfDoctor, RankOfDoctor } from "../app/model/enum/common";

export default class Utils {
  public static convertDDmmyyyTommDDyyyy = (value: string): string => {
    if (!value) return "";
    const arr = value.split("/");
    return `${arr[1]}/${arr[0]}/${arr[2]}`
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
        return "";
    }
  };

  public static getDoctorRankText = (rank: RankOfDoctor) => {
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

  public static getDoctorPositionText = (position: PositionOfDoctor) => {
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
}