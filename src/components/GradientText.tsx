import React, { ReactNode } from "react";
import styled, { keyframes } from "styled-components";

interface AnimatedGradientTextProps {
  color: string;
  children: ReactNode;
}

const gradientMove = keyframes`
  0% {
    background-position: 0% center;
  }
  50% {
    background-position: 100% center;
  }
  100% {
    background-position: 0% center;
  }
`;

const GradientText = styled.span<{ color: string }>`
  animation: ${gradientMove} 6s ease infinite;
  z-index:1;
  width:100%;

`;

const AnimatedGradientText: React.FC<AnimatedGradientTextProps> = ({
  color,
  children,
}) => {
  return <GradientText color={color}>{children}</GradientText>;
};

export default AnimatedGradientText;
