import "./Logo.css";
import logo from "../assets/logo_thermidor_web_agency.png";
import { motion, useScroll, useTransform } from "framer-motion";

const Logo: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <>
      <div className={`container-logo`}>
        <motion.div
          style={{
            scale,
            backgroundColor: "#e4e1d0", // Couleur d'exemple,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "0.3em",
          }}
        >
          <img src={logo} alt="Logo Thermidor Agence Web Lille" />
          <div className="text-logo-container">
            <h1>THERMIDOR</h1>
            <h1>AGENCE WEB</h1>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Logo;
