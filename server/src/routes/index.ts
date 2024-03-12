import { Router } from "express";
import accountRoute from "../module/account/account.route";
import userRoute from "../module/user/user.route";
import typeAppointmentRoute from "../module/typeAppointment/typeAppointment.route";
import medicationRoute from "../module/medication/medication.route";
import departmentRouter from "../module/department/department.route";
import doctorRoute from "../module/doctor/doctor.route";
import scheduleRoute from "../module/schedule/schedule.route";

const routes = Router();
routes.use("/auth", accountRoute);
routes.use("/user", userRoute);
routes.use("/typeAppointment", typeAppointmentRoute);
routes.use("/medication", medicationRoute);
routes.use("/department", departmentRouter);
routes.use("/doctor", doctorRoute);
routes.use("/schedule", scheduleRoute);

export default routes;
