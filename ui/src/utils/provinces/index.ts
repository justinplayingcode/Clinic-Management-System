import city from "./tinh_tp.json";
import district from "./quan_huyen.json";
import ward from "./xa_phuong.json";

interface IResponseType {
  value: string,
  label: string
}

export default class ProvincesUtils {
  private static _city = Object.values(city);
  private static _district = Object.values(district);
  private static _ward = Object.values(ward);

  public static getAllCityName = (): IResponseType[] => {
    return ProvincesUtils._city.map(e => {
      return {
        value: e.code,
        label: e.name_with_type
      }
    })
  }

  public static getAllDistrictByCity = (city?: string): IResponseType[] => {
    const result: IResponseType[] = [];
    if (city === '') {
      return result;
    }
    const citycode = ProvincesUtils._city.find(e => e.name_with_type === city?.trim())?.code;
    ProvincesUtils._district.forEach(e => {
      if (e.parent_code === citycode) {
        result.push({
          value: e.code,
          label: e.name_with_type
        })
      }
    })
    return result;
  }

  public static getAllWardByCity = (district?: string): IResponseType[] => {
    const result: IResponseType[] = [];
    if (district === '') {
      return result;
    }
    const districtcode = ProvincesUtils._district.find(e => e.name_with_type === district?.trim())?.code;
    ProvincesUtils._ward.forEach(e => {
      if (e.parent_code === districtcode) {
        result.push({
          value: e.code,
          label: e.name_with_type
        })
      }
    })
    return result;
  }
}