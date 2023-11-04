import { Navigate, Route, HashRouter as Router, Routes } from "react-router-dom";
import UniformLayout from "./structure";
import { Appointment, Histories, ManageAccount, ManageDepartment, Medications, Overview, Schedule } from "./page";
import { routerString } from "./model/router";
import LandingPage from "./page/LandingPage";
import ErrorPage from "./structure/ErrorPage";
import { ErrorPageEnum } from "./model/enum/common";

function Routing() {

  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={ localStorage.getItem('accessToken') ? <Navigate to={`${routerString.home}`}/> : <LandingPage/>} />
        <Route path={`${routerString.home}`} element={<UniformLayout page={<Overview/>} noBackground/>}/>
        <Route path={`${routerString.histories}`} element={<UniformLayout page={<Histories/>}/>}/>
        <Route path={`${routerString.appointment}`} element={<UniformLayout page={<Appointment/>}/>}/>
        <Route path={`${routerString.manageaccount}`} element={<Navigate to={`${routerString.manageaccountdoctor}`} />}/>
        <Route path={`${routerString.manageaccountdoctor}`} element={<UniformLayout page={<ManageAccount/>}/>}/>
        <Route path={`${routerString.manageaccountuser}`} element={<UniformLayout page={<ManageAccount/>}/>}/>
        <Route path={`${routerString.managemedication}`} element={<UniformLayout page={<Medications/>}/>}/>
        <Route path={`${routerString.managedepartment}`} element={<UniformLayout page={<ManageDepartment/>}/>}/>
        <Route path={`${routerString.schedule}`} element={<UniformLayout page={<Schedule/>} noBackground/>}/>
        {/*  */}
        <Route path={`${routerString.Forbidden}`} element={<ErrorPage pageType={ErrorPageEnum.Forbidden}/>}/>
        <Route path={`${routerString.Unauthorized}`} element={<ErrorPage pageType={ErrorPageEnum.Unauthorized}/>}/>
        <Route path={`${routerString.ServerError}`} element={<ErrorPage pageType={ErrorPageEnum.ServerError}/>}/>
      </Routes>
    </Router>
  );
}

export default Routing;