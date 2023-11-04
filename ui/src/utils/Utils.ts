export default class Utils {
  public static convertDDmmyyyTommDDyyyy = (value: string): string => {
    const arr = value.split("/");
    return `${arr[1]}/${arr[0]}/${arr[2]}`
  }
}