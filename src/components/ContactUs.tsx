import styled from "styled-components";
import { MessageCircle } from "lucide-react";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: inherit;
  padding: 1.5rem;
`;

const Card = styled.div`
  background: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 28rem;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2em;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-family:Helvetica, sans-serif;
  font-weight: 600;
  color: #1f2937;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #4b5563;
  transition: color 0.2s;

  &:hover {
    color: #111827;
  }
`;

const WhatsAppLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #16a34a;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #166534;
  }
`;

const Text = styled.span`
  font-size: 1rem;
  user-select: all;
  @media (max-width: 768px) {
    text-align: center;
    font-size: 0.8rem;
  }
`;

export default function ContactPage() {
  return (
    <PageWrapper>
      <Card>
        <Title>Contactez-nous</Title>

        <InfoRow>
            <a href="mailto:contact@thermidor-agence-web.fr">contact@thermidor-agence-web.fr</a>
        </InfoRow>

        <WhatsAppLink
          href="https://wa.me/33626304326"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={20} />
          <Text>WhatsApp</Text>
        </WhatsAppLink>
      </Card>
    </PageWrapper>
  );
}
