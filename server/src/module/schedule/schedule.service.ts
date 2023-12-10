import { ClientSession } from "mongoose";
import ScheduleRepository from "./schedule.repository";
import Schedule from "./schedule.schema";
import { ICreateSchedule, StatusAppointment } from "./schedule.model";
import logger from "../../helper/logger.config";
import DoctorService from "../doctor/doctor.service";
import PatientService from "../patient/patient.service";
import MomentTimezone from "../../helper/timezone.config";
import { IRequestGetAllOfStaticReport } from "../user/user.model";

export default class ScheduleService {
  private _scheduleRepository;
  private _doctorService;
  private _patientService;

  constructor() {
    this._scheduleRepository = new ScheduleRepository(Schedule);
    this._doctorService = new DoctorService();
    this._patientService = new PatientService();
  }

  public createSchedule = async (data: ICreateSchedule, session: ClientSession) => {
    try {
      const newSchedule = {
        ...data,
        status: StatusAppointment.Checking,
        statusUpdateTime: new Date,
      }
      return await this._scheduleRepository.create(newSchedule, session);
    } catch (error) {
      logger("createSchedule-scheduleService", error?.message);
      throw error;
    }
  }

  public findById = async (id) => {
    try {
      return await this._scheduleRepository.findById(id);
    } catch (error) {
      logger("findById-scheduleService", error?.message);
      throw error;
    }
  }

  public adminGetSchedule = async (condition) => {
    try {
      const schedules = await this._scheduleRepository.getAll(condition);
      const result = schedules.map( async schedule => {
        let doctor = undefined;
        let patient = undefined;
        if (schedule.doctorId) {
          doctor = await this._doctorService.getInfoById(schedule.doctorId);
        }
        if (schedule.patientId) {
          patient = await this._patientService.getInfoById(schedule.patientId);
        }
        return {
          ...schedule,
          appointmentDate: MomentTimezone.convertDDMMYYY(schedule.appointmentDate),
          doctor: doctor,
          patient: patient
        };
      })
      return await Promise.all(result);
    } catch (error) {
      throw error
    }
  }

  public doctorGetSchedule = async (condition) => {
    try {
      const schedules = await this._scheduleRepository.getAll(condition);
      const result = schedules.map( async schedule => {
        let patient = undefined;
        if (schedule.patientId) {
          patient = await this._patientService.getInfoById(schedule.patientId);
        }
        return {
          ...schedule,
          appointmentDate: MomentTimezone.convertDDMMYYY(schedule.appointmentDate),
          patient: patient
        };
      })
      return await Promise.all(result);
    } catch (error) {
      throw error
    }
  }

  public userGetSchedule = async (condition) => {
    try {
      const schedules = await this._scheduleRepository.getAll(condition);
      const result = schedules.map( async schedule => {
        let doctor = undefined;
        let patient = undefined;
        if (schedule.doctorId) {
          doctor = await this._doctorService.getInfoById(schedule.doctorId);
        }
        if (schedule.patientId) {
          patient = await this._patientService.getInfoById(schedule.patientId);
        }
        return {
          ...schedule,
          appointmentDate: MomentTimezone.convertDDMMYYY(schedule.appointmentDate),
          doctor: doctor,
          patient: patient
        };
      })
      return await Promise.all(result);
    } catch (error) {
      logger("scheduleService-userGetSchedule", error?.message);
      throw error;
    }
  }

  public updateById = async (id, data, session: ClientSession) => {
    try {
      return await this._scheduleRepository.updateById(id, data, session);
    } catch (error) {
      logger("scheduleService-userGetSchedule", error?.message);
      throw error;
    }
  }

  public completeSchedule = async (id, session: ClientSession) => {
    try {
      const update = {
        status: StatusAppointment.Complete,
        statusUpdateTime: new Date,
      }
      return await this._scheduleRepository.updateById(id, update, session);
    } catch (error) {
      logger("scheduleService-userGetSchedule", error?.message);
      throw error;
    }
  }

  public getCompleteSchedule = async (params: IRequestGetAllOfStaticReport) => {
    try {
      const _result = await this._scheduleRepository.getForReport(params.page, params.pageSize, { status: StatusAppointment.Complete, ...params.conditions });
      const result = _result.map(e => {
        const { departmentId, typeAppointmentId } = e;
        return {
          ...e,
          appointmentDate: MomentTimezone.convertDDMMYYY(e.appointmentDate),
          departmentName: departmentId.displayName,
          typeAppointment: typeAppointmentId.displayName,
        }
      })
      return {
        values: result,
        total: result.length
      }
    } catch (error) {
      logger("scheduleService-getCompleteSchedule", error?.message);
      throw error;
    }
  }
}