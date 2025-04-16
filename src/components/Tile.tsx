import React from 'react';
import styled from 'styled-components';

interface TileProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const TileContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
  transition: all 0.3s ease-in-out;

  &:hover {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-5px);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  animation: fadeIn 0.5s ease-in-out;
`;

const TileTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const TileDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

const TileIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 15px;
  color: #333;
`;

const Tile: React.FC<TileProps> = ({ title, description, icon }) => {
  return (
    <TileContainer>
      <TileIcon>{icon}</TileIcon>
      <TileTitle>{title}</TileTitle>
      <TileDescription>{description}</TileDescription>
    </TileContainer>
  );
};

export default Tile;