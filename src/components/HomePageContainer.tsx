import styled from "styled-components";
import { Cta1, Cta2, Cta3 } from "./HomePageComponents";
import LogoWelcomePage from "./LogoWelcomePage";
import MovingCircles from "./MovingCircles";

const ContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  align-items: center;
  margin-top: 100vh;
  z-index:1;
`;

const BlurringDiv = styled.div`
  width: 100vw;
  height:100vh;
  position: fixed;
  display: block;
  top: 0;
  left:0;
  backdrop-filter: blur(32px);
  z-index:1;
`

const HomePageContainer: React.FC = () => (
  <>
    <BlurringDiv/>
    <MovingCircles colors={['#D9FAD7', '#DBB846', '#98E9E3', '#CAD783', '#4D608B']} />
    <LogoWelcomePage />
    <ContentDiv>
      <Cta1 />
      <Cta2 />
      <Cta3 />
    </ContentDiv>
  </>
);

export default HomePageContainer;
