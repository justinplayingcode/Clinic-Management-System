import BaseRepository from "../common/common.repository";
import { typeAppointmentModel } from "./typeAppointment.model";
export default class typeAppointmentRepository extends BaseRepository<typeAppointmentModel> {
  public getAll = async () => {
    return await this.model.find().select(`-__v`);
  }
}
