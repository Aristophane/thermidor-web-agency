import "./LogoAllPages.css";
import { Link } from "react-router-dom";

const LogoAllPages: React.FC = () => {
  return (
    <>
      <Link to="/">
        <div className="all-underneathOverlay-logo">
          <div className={`all-container-logo`}>
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
