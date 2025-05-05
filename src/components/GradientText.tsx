import React, { ReactNode } from "react";
import styled from "styled-components";

interface AnimatedGradientTextProps {
  color: string;
  children: ReactNode;
}

const GradientText = styled.span<{ color: string }>`
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
