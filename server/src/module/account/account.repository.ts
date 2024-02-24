import BaseRepository from "../common/common.repository";
import { AccountModel } from "./account.model";

// kế thừa
export default class AccountRepository extends BaseRepository<AccountModel> {
  // viết riêng cũng được nhưng bị lặp code => code trùng nhiều
  // trong này chỉ để viết phương thức riêng
}