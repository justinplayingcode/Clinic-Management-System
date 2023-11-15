import { Navigate, Route, HashRouter as Router, Routes } from "react-router-dom";
import UniformLayout from "./structure";
import { Appointment, Histories, ManageDepartment, Medications, Overview, Schedule } from "./page";
import { routerString } from "./model/router";
import LandingPage from "./page/LandingPage";
import ErrorPage from "./structure/ErrorPage";
import { ErrorPageEnum } from "./model/enum/common";
import ManageDoctor from "./page/ManageAccount/ManageDoctor";
import ManageUser from "./page/ManageAccount/ManageUser";
import ManageService from "./page/ManageService";

function Routing() {

  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path={`${routerString.home}`} element={<UniformLayout page={<Overview/>} noBackground/>}/>
        <Route path={`${routerString.histories}`} element={<UniformLayout page={<Histories/>}/>}/>
        <Route path={`${routerString.appointment}`} element={<UniformLayout page={<Appointment/>}/>}/>
        <Route path={`${routerString.manageaccount}`} element={<Navigate to={`${routerString.manageaccountdoctor}`} />}/>
        <Route path={`${routerString.manageaccountdoctor}`} element={<UniformLayout page={<ManageDoctor/>}/>}/>
        <Route path={`${routerString.manageaccountuser}`} element={<UniformLayout page={<ManageUser/>}/>}/>
        {/* <Route path={`${routerString.managemedication}`} element={<UniformLayout page={<Medications/>}/>}/> */}
        <Route path={`${routerString.managedepartment}`} element={<UniformLayout page={<ManageDepartment/>}/>}/>
        <Route path={`${routerString.schedule}`} element={<UniformLayout page={<Schedule/>} noBackground/>}/>
        <Route path={`${routerString.managedepartments}`} element={<UniformLayout page={<ManageDepartment/>} noBackground/>}/>
        <Route path={`${routerString.manageservice}`} element={<UniformLayout page={<ManageService/>} noBackground/>}/>
        <Route path={`${routerString.managemedication}`} element={<UniformLayout page={<Medications/>}/>}/>
        {/*  */}
        <Route path={`${routerString.Forbidden}`} element={<ErrorPage pageType={ErrorPageEnum.Forbidden}/>}/>
        <Route path={`${routerString.Unauthorized}`} element={<ErrorPage pageType={ErrorPageEnum.Unauthorized}/>}/>
        <Route path={`${routerString.ServerError}`} element={<ErrorPage pageType={ErrorPageEnum.ServerError}/>}/>
        <Route path="*" element={<Navigate to={`${routerString.Unauthorized}`} replace />} />
      </Routes>
    </Router>
  );
}

export default Routing;