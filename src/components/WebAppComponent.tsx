import React, { useEffect, useState } from 'react';
import './WebAppCreation.css'; // Import du fichier CSS

const WebAppCreation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation d'apparition après le montage du composant
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`web-app-creation ${isVisible ? 'visible' : ''}`}>
      <div className="content-wrapper">
        <h2 className="title">Création Sites Web & Applications</h2>
        <p className="description">
          Notre équipe conçoit des sites web modernes et des applications sur-mesure pour répondre à vos besoins professionnels. 
          Bénéficiez d'une expérience fluide et d'une interface élégante, pensée pour engager vos utilisateurs.
        </p>
        <button className="cta-button">En savoir plus</button>
      </div>
    </section>
  );
};

export default WebAppCreation;
