import  { ReactNode, useEffect, useRef, useState } from 'react';

import styled, { keyframes } from 'styled-components';

interface AnimatedButtonTextProps{
    children: ReactNode;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0px rgba(255, 50, 56, 0.5);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 8px rgba(255, 50, 56, 0.5);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0px rgba(255, 50, 56, 0.5);
  }
`;

export const StyledButton = styled.button`
  background-color: #ff3238;
  color: #fff;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0;
  transform: translateY(10px);
  transition: background-color 0.3s ease;

  &.visible {
    animation: ${fadeIn} 0.6s ease-out forwards;
  }

  &:hover {
    background-color: #cc2a30;
    animation: ${pulse} 0.6s ease-in-out;
  }
`;

const AnimatedButton: React.FC<AnimatedButtonTextProps> = ({ children }) => {
  const buttonRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Optional: remove after it appears once
        }
      },
      { threshold: 0.1 }
    );

    if (buttonRef.current) {
      observer.observe(buttonRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <StyledButton ref={buttonRef} className={isVisible ? 'visible' : ''}>
      {children}
    </StyledButton>
  );
};

export default AnimatedButton;
