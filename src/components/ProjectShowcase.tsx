import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

export type Project = {
  id: string;
  imageUrl: string;
  companyName: string;
  companyLogoUrl: string;
  siteUrl: string;
  title: string;
  description: string;
};

type Props = {
  projects: Project[];
};

const Section = styled.section`
  background-color: #4d608b;
  padding: 4rem 2rem;
  color: white;
  font-family: 'Helvetica', sans-serif;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 3rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const MotionCard = styled(motion.div)`
  background-color: white;
  color: #1a1a1a;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Company = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  img {
    width: 32px;
    height: 32px;
    object-fit: contain;
    margin-right: 0.5rem;
  }

  span {
    font-weight: 600;
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 0.9rem;
  flex-grow: 1;
  margin-bottom: 1rem;
`;

const Link = styled.a`
  color: #2a63ff;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const ProjectShowcase: React.FC<Props> = ({ projects }) => {
  return (
    <Section>
      <Container>
        <Title>Nos Projets</Title>
        <Grid>
          {projects.map((project, index) => (
            <MotionCard
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Image src={project.imageUrl} alt={project.title} />
              <Content>
                <Company>
                  <img src={project.companyLogoUrl} alt={project.companyName} />
                  <span>{project.companyName}</span>
                </Company>
                <ProjectTitle>{project.title}</ProjectTitle>
                <Description>{project.description}</Description>
                <Link href={project.siteUrl} target="_blank" rel="noopener noreferrer">
                  Voir le site →
                </Link>
              </Content>
            </MotionCard>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default ProjectShowcase;
