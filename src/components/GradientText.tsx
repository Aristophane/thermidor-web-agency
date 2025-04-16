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
  display: inline-block;
  background-image: ${({ color }) =>
    `linear-gradient(270deg, ${color}, #fc7074, ${color})`};
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: ${gradientMove} 6s ease infinite;
`;

const AnimatedGradientText: React.FC<AnimatedGradientTextProps> = ({
  color,
  children,
}) => {
  return <GradientText color={color}>{children}</GradientText>;
};

export default AnimatedGradientText;
