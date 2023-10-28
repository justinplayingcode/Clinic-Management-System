
import './index.scss'

interface IUniformLayout {
  content: JSX.Element
}

function Layout({ ...props}: IUniformLayout) {
  return (  
    <div id="landing-main-wrapper">
      <div className="landing-main-content">
        <div className="landing-main-content-header">
          {/* <Header/> */}
        </div>
        <div className="landing-main-content-main">
          {props.content}
          {/* <Footer/> */}
        </div>
      </div>
      </div>
  );
}

export default Layout;