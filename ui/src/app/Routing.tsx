import { Route, HashRouter as Router, Routes } from "react-router-dom";
import UniformLayout from "./structure";
import { Appointment, Histories, Overview, Schedule } from "./page";
import { routerString } from "./model/router";
import LandingPage from "./page/LandingPage";
import ErrorPage from "./structure/ErrorPage";
import { ErrorPageEnum } from "./model/enum/common";

function Routing() {
  // const token = localStorage.getItem('accessToken');

  // const navigateHome = () => {
  //   if(!token) {
  //     return <Navigate to={`${routerString.Forbidden}`} replace/> //redirect to expired page
  //   }
  //   return <UniformLayout page={<Overview/>}/>
  // }

  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path={`${routerString.home}`} element={<UniformLayout page={<Overview/>}/>} />
        <Route path={`${routerString.histories}`} element={<UniformLayout page={<Histories/>}/>} />
        <Route path={`${routerString.appointment}`} element={<UniformLayout page={<Appointment/>}/>} />
        <Route path={`${routerString.schedule}`} element={<UniformLayout page={<Schedule/>}/>} />
        <Route path={`${routerString.Forbidden}`} element={<ErrorPage pageType={ErrorPageEnum.Forbidden}/>} />
        <Route path={`${routerString.Unauthorized}`} element={<ErrorPage pageType={ErrorPageEnum.Unauthorized}/>} />
        <Route path={`${routerString.ServerError}`} element={<ErrorPage pageType={ErrorPageEnum.ServerError}/>} />
      </Routes>
    </Router>
  );
}

export default Routing;