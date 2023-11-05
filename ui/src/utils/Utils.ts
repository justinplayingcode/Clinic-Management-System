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
}