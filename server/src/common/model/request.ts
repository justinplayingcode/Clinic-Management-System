export interface IValidateReqBody {
  pass: boolean,
  message? : string
}

export interface IStaticReportRequest {
  page: number;
  pageSize: number;
  searchByColumn: string;
  searchKey: string;
}