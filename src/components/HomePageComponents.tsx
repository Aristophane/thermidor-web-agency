import { Link } from "react-router-dom";
import { styled, css } from "styled-components";
import { useInView } from "react-intersection-observer";


// Wrapper animable
const FadeInOnView = styled.div<{ isVisible: boolean }>`
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;

  ${({ isVisible }) =>
    isVisible &&
    css`
      opacity: 1;
      transform: translateY(0);
    `}
`;

// Container principal
const CtaFullWidthContainer = styled.div<{ backgroundcolor: string }>`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  background-color: ${({ backgroundcolor }) => backgroundcolor};
  text-align: left;
  box-sizing: border-box;
  margin: 0;
  padding-left: 20%;
  flex-wrap: wrap;
 z-index: 2;
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding-left: 0%;
  }
`;

const TextContent = styled.div`
  flex: 1;
  z-index: 2;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  @media (max-width: 768px) {
    align-items: center;
    padding-left: 15%;
    padding-right: 15%;
  }
`;

const Title = styled.h2`
  font-size: clamp(1.8rem, 3.2vw, 3rem);
  margin-bottom: 12px;
  color: var(--text);
  text-shadow: 0 2px 30px rgba(0,0,0,0.35);
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const Description = styled.p`
  font-size: 1.05rem;
  margin-bottom: 20px;
  color: var(--muted);
`;

const Button = styled.button`
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.18);
  color: var(--text);
  padding: 12px 24px;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 1rem;
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.25);
    background: linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04));
  }
`;

// Composant CTA avec effet d'apparition
const CtaSection = ({
  backgroundcolor,
  title,
  description,
  buttonText,
}: {
  backgroundcolor: string;
  title: string;
  description: string;
  buttonText: string;
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <CtaFullWidthContainer backgroundcolor={backgroundcolor}>
      <TextContent ref={ref}>
        <FadeInOnView isVisible={inView}>
          <Title>{title}</Title>
        </FadeInOnView>
        <FadeInOnView isVisible={inView}>
          <Description>{description}</Description>
        </FadeInOnView>
        <FadeInOnView isVisible={inView}>
          <Link to="/contact">
            <Button>{buttonText}</Button>
          </Link>
        </FadeInOnView>
      </TextContent>
    </CtaFullWidthContainer>
  );
};

// Déclinaisons
const Cta1 = () => (
  <CtaSection
    backgroundcolor="#1b1e25"
    title="Un site parfaitement taillé pour vos besoins ?"
    description="E-Commerce, Site Vitrine, Back Office, Interface Client"
    buttonText="Contactez-nous"
  />
);

const Cta2 = () => (
  <CtaSection
    backgroundcolor="#14161b"
    title="Besoin d'une expertise Tech pour votre SI ?"
    description="Faites appel à nos services de DSI partagée au meilleur prix"
    buttonText="Faites appel à nos experts"
  />
);

const Cta3 = () => (
  <CtaSection
    backgroundcolor="#0e0f12"
    title="Envie de développer votre impact ?"
    description="Nous gérons vos campagnes marketing et optimisons votre SEO"
    buttonText="Augmenter votre impact marketing"
  />
);

export { Cta1, Cta2, Cta3 };
