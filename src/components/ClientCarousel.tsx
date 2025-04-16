import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';

const CarouselContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Slide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ClientPhoto = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
`;

const CompanyLogo = styled.img`
  width: 100px;
  height: auto;
`;

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1
      }
    }
  ]
};

type Client = {
  photoUrl: string;
  logoUrl: string;
};

type Props = {
  clients: Client[];
};

const ClientCarousel: React.FC<Props> = ({ clients }) => {
  return (
    <CarouselContainer>
      <Slider {...settings}>
        {clients.map((client, index) => (
          <Slide key={index}>
            <ClientPhoto src={client.photoUrl} alt={`Client ${index + 1}`} />
            <CompanyLogo src={client.logoUrl} alt={`Logo ${index + 1}`} />
          </Slide>
        ))}
      </Slider>
    </CarouselContainer>
  );
};

export default ClientCarousel;
