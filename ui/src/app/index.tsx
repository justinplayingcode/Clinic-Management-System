import { Provider } from "react-redux"
import store from "../redux"
import "./index.scss"
import Routing from "./Routing"
import { ConfigProvider } from 'antd'
import { initializeIcons } from "@fluentui/react"

initializeIcons();
const App: React.FunctionComponent = () => {
  return (
      <Provider store={store}>
        <ConfigProvider
          theme={{
            components: {
              Breadcrumb: {
                lastItemColor: "#0067A2",
                linkColor: "#0067A2",
                linkHoverColor: "#0067A2"
              },
            },
          }}
        >
          <Routing/>             
        </ConfigProvider>
      </Provider>
  )
}

export default App