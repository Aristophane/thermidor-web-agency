import React, { useEffect, useState } from 'react';
import './WebAppComponent.css';

const WebAppComponent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Activation de l'animation après un léger délai
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="web-app-creation">
      <div className={`tiles-container ${isVisible ? 'visible' : ''}`}>
        <div className="tile tile-1">
          <h3>Sites Web sur-mesure</h3>
          <p>Conception de sites web adaptés à vos besoins, avec un design unique et une navigation fluide.</p>
        </div>
        <div className="tile tile-2">
          <h3>Applications Mobiles</h3>
          <p>Développement d’applications performantes, optimisées pour tous les appareils et plateformes.</p>
        </div>
        <div className="tile tile-3">
          <h3>Expérience Utilisateur</h3>
          <p>Nous créons des interfaces intuitives et engageantes pour améliorer l’expérience utilisateur.</p>
        </div>
        <div className="tile tile-4">
          <h3>Responsive Design</h3>
          <p>Des solutions qui s’adaptent à tous les écrans, pour une expérience optimale sur mobile et desktop.</p>
        </div>
      </div>
    </section>
  );
};

export default WebAppComponent;
