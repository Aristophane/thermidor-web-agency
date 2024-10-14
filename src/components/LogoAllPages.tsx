import "./LogoAllPages.css";
import logo from "../assets/logo_thermidor_web_agency.png";

const LogoAllPages: React.FC = () => {
  return (
    <>
      <div className="all-underneathOverlay-logo">
        <div className={`all-container-logo`}>
          <img src={logo} alt="Logo Thermidor Agence Web Lille" />
          <div className="all-text-logo-container">
            <h1>THERMIDOR</h1>
            <h1>AGENCE WEB</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoAllPages;
