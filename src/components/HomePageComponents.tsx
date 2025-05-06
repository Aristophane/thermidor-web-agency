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
const CtaFullWidthContainer = styled.div<{ backgroundColor: string }>`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  background-color: ${({ backgroundColor }) => backgroundColor};
  text-align: left;
  box-sizing: border-box;
  margin: 0;
  padding-left: 20%;
  flex-wrap: wrap;

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
  font-size: 2rem;
  margin-bottom: 12px;
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: transparent;
  border: 2px solid white;
  color: #fff;
  padding: 12px 24px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #cc2a30;
  }
`;

// Composant CTA avec effet d'apparition
const CtaSection = ({
  backgroundColor,
  title,
  description,
  buttonText,
}: {
  backgroundColor: string;
  title: string;
  description: string;
  buttonText: string;
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <CtaFullWidthContainer backgroundColor={backgroundColor}>
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
    backgroundColor="#4D608B"
    title="Un site parfaitement taillé pour vos besoins ?"
    description="E-Commerce, Site Vitrine, Back Office, Interface Client"
    buttonText="Contactez-nous"
  />
);

const Cta2 = () => (
  <CtaSection
    backgroundColor="#DBB846"
    title="Besoin d'une expertise Tech pour votre SI ?"
    description="Faites appel à nos services de DSI partagée au meilleur prix"
    buttonText="Faites appel à nos experts"
  />
);

const Cta3 = () => (
  <CtaSection
    backgroundColor="#e94e77"
    title="Envie de développer votre impact ?"
    description="Nous gérons vos campagnes marketing et optimisons votre SEO"
    buttonText="Augmenter votre impact marketing"
  />
);

export { Cta1, Cta2, Cta3 };
