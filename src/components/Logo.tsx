import "./Logo.css";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedGradientText from "./GradientText";

const Logo: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <>
      <div className={`container-logo`}>
        <motion.div
          style={{
            scale,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "0.3em",
            width: "100%",
          }}
        >
          <div className="text-logo-container">
            <AnimatedGradientText color="#ff3238">
              <div className="titleBlock">
                <h1 className="logoTitle">thermidor</h1>
                <h2 className="logoTitle">agence web</h2>
              </div>
            </AnimatedGradientText>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Logo;
