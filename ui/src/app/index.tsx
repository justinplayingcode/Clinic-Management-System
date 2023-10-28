import { Route, HashRouter , Routes, Navigate } from 'react-router-dom'
import "./index.scss";

const App: React.FunctionComponent = () => {

  return (
    <HashRouter basename="/">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </HashRouter>
  )
}

export default App