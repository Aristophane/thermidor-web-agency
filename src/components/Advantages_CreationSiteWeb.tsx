import styled, { keyframes } from 'styled-components';
import { FaHandsHelping, FaPencilRuler, FaSearch, FaUserFriends } from 'react-icons/fa';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 40px;
`;

const Tile = styled.div`
  background-color: #e4e1d0;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  color: #ff3238;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: ${fadeIn} 0.6s ease forwards;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  margin-bottom: 15px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #ff3238;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #333;
  line-height: 1.4;
`;

const Advantages_CreationSiteWeb = () => {
  return (
    <Container>
      <Tile>
        <IconWrapper><FaHandsHelping /></IconWrapper>
        <Title>Une équipe réactive et professionnelle</Title>
        <Description>
          Notre équipe est toujours disponible pour répondre rapidement et efficacement à vos besoins.
        </Description>
      </Tile>

      <Tile>
        <IconWrapper><FaPencilRuler /></IconWrapper>
        <Title>Un design sur mesure adapté à vos besoins</Title>
        <Description>
          Nous concevons des designs uniques et personnalisés pour refléter votre image de marque.
        </Description>
      </Tile>

      <Tile>
        <IconWrapper><FaSearch /></IconWrapper>
        <Title>Une optimisation SEO pour améliorer votre visibilité</Title>
        <Description>
          Boostez votre présence en ligne avec une optimisation SEO qui améliore votre positionnement.
        </Description>
      </Tile>

      <Tile>
        <IconWrapper><FaUserFriends /></IconWrapper>
        <Title>Un accompagnement personnalisé tout au long du projet</Title>
        <Description>
          Profitez d'un suivi constant et de conseils personnalisés pour un projet réussi.
        </Description>
      </Tile>
    </Container>
  );
};

export default Advantages_CreationSiteWeb;
