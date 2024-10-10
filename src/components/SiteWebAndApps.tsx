import React from 'react';
import './SiteWebAndApps.css'; // Optionnel : pour ajouter des styles spécifiques

const SiteWebAndApps = () => {
  return (
    <section className="agency-capabilities">
      <div className="hero-section">
        <h1 className="hero-title">Nous réalisons des sites web et applications performants</h1>
        <p className="hero-description">Que vous ayez besoin d'un site vitrine, d'une plateforme e-commerce, ou d'une application sur-mesure, notre agence est là pour concrétiser vos idées.</p>
      </div>

      <div className="services-section">
        <h2 className="section-title">Nos Services</h2>
        <div className="services-list">
          <div className="service-item">
            <h3>Développement Web</h3>
            <p>Création de sites web responsive, optimisés pour tous les appareils.</p>
          </div>
          <div className="service-item">
            <h3>Développement d'Applications</h3>
            <p>Applications mobiles et web sur-mesure adaptées à vos besoins d'affaires.</p>
          </div>
          <div className="service-item">
            <h3>UX/UI Design</h3>
            <p>Design élégant et intuitif pour une expérience utilisateur optimale.</p>
          </div>
          <div className="service-item">
            <h3>Maintenance et Support</h3>
            <p>Suivi et amélioration continue pour assurer la pérennité de vos projets.</p>
          </div>
        </div>
      </div>

      <div className="portfolio-section">
        <h2 className="section-title">Exemples de Projets</h2>
        <div className="portfolio-list">
          <div className="portfolio-item">
            <img src="project1.jpg" alt="Projet 1" />
            <p>Plateforme e-commerce pour une marque de mode</p>
          </div>
          <div className="portfolio-item">
            <img src="project2.jpg" alt="Projet 2" />
            <p>Application mobile pour la gestion d'événements</p>
          </div>
          <div className="portfolio-item">
            <img src="project3.jpg" alt="Projet 3" />
            <p>Site vitrine pour une start-up technologique</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Prêt à démarrer votre projet ?</h2>
        <p>Contactez-nous pour discuter de vos besoins et découvrir comment nous pouvons vous aider à réussir.</p>
        <button className="cta-button">Contactez-nous</button>
      </div>
    </section>
  );
};

export default SiteWebAndApps;
