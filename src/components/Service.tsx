import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Section = styled.section`
  padding: 6rem 2rem 8rem;
  position: relative;
  z-index: 2;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4vw, 3.2rem);
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  margin: 0;
  color: var(--muted);
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled(motion.div)`
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 20px 50px rgba(0,0,0,0.35);
`;

const CardTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
`;

const CardText = styled.p`
  margin: 0 0 1rem 0;
  color: var(--muted);
`;

const Cta = styled.a`
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
`;

const Service: React.FC = () => {
  const services = [
    {
      title: "Création de sites web",
      text: "Sites vitrines, e-commerce, portails et back-office sur mesure.",
    },
    {
      title: "Applications web & mobiles",
      text: "Front-end réactif, APIs robustes et applications cross-platform.",
    },
    {
      title: "SEO & Marketing",
      text: "Optimisation SEO, campagnes SEA, analytics et contenu.",
    },
    {
      title: "UI/UX design",
      text: "Expériences intuitives, parcours utilisateurs et design system.",
    },
    {
      title: "Branding",
      text: "Identité visuelle, chartes graphiques et guidelines.",
    },
    {
      title: "DSI à temps partagé",
      text: "Pilotage technique, architecture et accompagnement produit.",
    },
  ];

  return (
    <Section>
      <Container>
        <Header>
          <Title>Nos Services</Title>
          <Subtitle>Des solutions sur mesure pour accélérer votre business</Subtitle>
        </Header>
        <Grid>
          {services.map((s, i) => (
            <Card
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <CardTitle>{s.title}</CardTitle>
              <CardText>{s.text}</CardText>
              <Cta href={"/contact"}>Discutons de votre projet →</Cta>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default Service;


