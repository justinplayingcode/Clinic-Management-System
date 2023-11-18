import BaseRepository from "../common/common.repository";
import { typeAppointmentModel } from "./typeAppointment.model";
export default class typeAppointmentRepository extends BaseRepository<typeAppointmentModel> {
  public getAll = async () => {
    await this.model.find();
  }
}
