import { Navigate, Route, HashRouter as Router, Routes } from "react-router-dom";
import UniformLayout from "./structure";
import { Appointment, Histories, Overview, Schedule } from "./page";
import { routerString } from "./model/router";
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import LandingPage from "./page/LandingPage";

function Routing() {
  const { phonenumber } = useSelector((state: RootState) => state.auth);

  const navigateHome = () => {
    if(!phonenumber) {
      return <Navigate to="/" replace/>
    }
    return <UniformLayout page={<Overview/>}/>
  }

  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path={`${routerString.home}`} element={navigateHome()} />
        <Route path={`${routerString.histories}`} element={<UniformLayout page={<Histories/>}/>} />
        <Route path={`${routerString.appointment}`} element={<UniformLayout page={<Appointment/>}/>} />
        <Route path={`${routerString.schedule}`} element={<UniformLayout page={<Schedule/>}/>} />
      </Routes>
    </Router>
  );
}

export default Routing;