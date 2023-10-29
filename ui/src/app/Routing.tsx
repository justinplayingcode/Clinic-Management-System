import { Navigate, Route, HashRouter as Router, Routes } from "react-router-dom";
import UniformLayout from "./structure";
import { Appointment, Histories, Overview, Schedule } from "./page";
import { routerString } from "./model/router";

function Routing() {
  return (
    <Router basename="/">
      <Routes>
        <Route path={`${routerString.login}`} element={<>login</>} />
        <Route path="/" element={<Navigate to={`${routerString.home}`} replace />} />
        <Route path={`${routerString.home}`} element={<UniformLayout page={<Overview/>}/>} />
        <Route path={`${routerString.histories}`} element={<UniformLayout page={<Histories/>}/>} />
        <Route path={`${routerString.appointment}`} element={<UniformLayout page={<Appointment/>}/>} />
        <Route path={`${routerString.schedule}`} element={<UniformLayout page={<Schedule/>}/>} />
      </Routes>
    </Router>
  );
}

export default Routing;