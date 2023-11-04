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
                itemColor: "#1E3461",
                linkColor: "1E3461",
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