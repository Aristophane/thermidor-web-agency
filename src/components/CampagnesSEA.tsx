import styled from "styled-components";

const ServicesSection = styled.section`
  padding: 5rem 0;
  background-color: #e4e1d0;
  text-align: center;

  p {
    color: #666;
  }
`;

const ServicesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ServiceCard = styled.div`
  flex: 1 1 300px;
  margin-bottom: 4rem;
  text-align: center;
`;

const ServiceTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ServiceDescription = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
`;

const CTAButton = styled.a`
  background-color: #007bff;
  color: #fff;
  padding: 1rem 2rem;
  text-decoration: none;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b2;
  }
`;

const CampagneSEA = () => {
  return (
    <ServicesSection>
      <h2>Nos services pour booster votre visibilité en ligne</h2>
      <p>
        Découvrez comment nos experts peuvent vous aider à atteindre vos
        objectifs.
      </p>
      <ServicesContainer>
        <ServiceCard>
          <ServiceTitle>Campagnes Sponsorisées (SEA)</ServiceTitle>
          <ServiceDescription>
            Augmentez votre visibilité en ligne grâce à des campagnes Google Ads
            personnalisées.
          </ServiceDescription>
          <CTAButton href="/sea">En savoir plus</CTAButton>
        </ServiceCard>
        <ServiceCard>
          <ServiceTitle>Référencement Naturel (SEO)</ServiceTitle>
          <ServiceDescription>
            Améliorez votre positionnement dans les résultats de recherche de
            Google.
          </ServiceDescription>
          <CTAButton href="/seo">Contactez-nous</CTAButton>
        </ServiceCard>
      </ServicesContainer>
    </ServicesSection>
  );
};

export default CampagneSEA;
