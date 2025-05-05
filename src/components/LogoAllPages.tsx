import "./LogoAllPages.css";
import logo from "../assets/logo_thermidor_web_agency.png";
import { Link } from "react-router-dom";

const LogoAllPages: React.FC = () => {
  return (
    <>
      <Link to="/">
        <div className="all-underneathOverlay-logo">
          <div className={`all-container-logo`}>
            <img src={logo} alt="Logo Thermidor Agence Web Lille" />
            <div className="all-text-logo-container">
              <h1>thermidor</h1>
              <h1>agence web</h1>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default LogoAllPages;
