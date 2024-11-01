import styled from 'styled-components';

const ServicesSection = styled.section`
  padding: 5rem 0;
  background-color: #e4e1d0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ServicesTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
`;

const ServicesDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.5;
  max-width: 800px;
  text-align: center;
  margin-bottom: 4rem;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ServiceCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
`;

const ServiceIcon = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 1rem;
`;

const ServiceTitleCard = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const ServiceDescriptionCard = styled.p`
  font-size: 1rem;
  line-height: 1.5;
`;

const Branding = () => {
  return (
    <ServicesSection>
      <ServicesTitle>Branding & Identité Visuelle</ServicesTitle>
      <ServicesDescription>
        Nous créons des identités visuelles fortes et mémorables qui reflètent votre marque et vous démarquent de la concurrence. 
      </ServicesDescription>
      <ServicesGrid>
        <ServiceCard>
          <ServiceIcon src="/logo.svg" alt="Logo" />
          <ServiceTitleCard>Création de logo</ServiceTitleCard>
          <ServiceDescriptionCard>Un logo unique et percutant pour représenter votre entreprise.</ServiceDescriptionCard>
        </ServiceCard>
        <ServiceCard>
          <ServiceIcon src="/palette.svg" alt="Palette" />
          <ServiceTitleCard>Charte graphique</ServiceTitleCard>
          <ServiceDescriptionCard>Une charte graphique complète pour une cohérence visuelle parfaite.</ServiceDescriptionCard>
        </ServiceCard>
        <ServiceCard>
          <ServiceIcon src="/booklet.svg" alt="Booklet" />
          <ServiceTitleCard>Guide de marque</ServiceTitleCard>
          <ServiceDescriptionCard>Un guide complet pour assurer la cohérence de votre marque.</ServiceDescriptionCard>
        </ServiceCard>
      </ServicesGrid>
    </ServicesSection>
  );
};

export default Branding;