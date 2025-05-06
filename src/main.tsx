import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import React from "react";
import WebAppComponent from "./components/WebAppComponent";
import LinksEnum from "./common/linksEnum";
import { Layout } from "./components/Layout";
import App from "./App";
import SiteWebSurMesure from "./components/SiteWebSurMesure";
import ApplicationMobile from "./components/ApplicationsMobiles";
import ResponsiveDesign from "./components/ResponsiveDesign";
import ExperienceUtilisateur from "./components/ExperienceUtilisateur";
import CampagneSEA from "./components/CampagnesSEA";
import Branding from "./components/Branding";
import ContactUs from "./components/ContactUs";
import ProjectShowcase, { Project } from "./components/ProjectShowcase";
import boillotLogo from "./assets/logoBoillot.jpeg"
import imageBoillot from "./assets/imageBoillot.jpg"
import logoCharletBois from "./assets/charletBois.png"
import logoMaisonCharlet from "./assets/maisonCharlet.png"
import imageCharletBois from "./assets/charletBoisProjet.png"
import imageMaisonCharlet from "./assets/imageMaisonCharlet.png"

const dummyProjects: Project[] = [
  {
    id: "1",
    imageUrl: imageBoillot,
    companyName: "Boillot & Co",
    companyLogoUrl: boillotLogo,
    siteUrl: "https://www.boillotandco.fr/",
    title: "Création d'une interface de prise de rendez-vous",
    description:
      "En lien avec le CRM BigChange utilisé par Boillot & Co nous avons développé une interface à destination des clients pour automatiser la prise de rendez-vous.",
  },
  {
    id: "2",
    imageUrl: imageCharletBois,
    companyName: "Charlet Bois",
    companyLogoUrl: logoCharletBois,
    siteUrl: "https://charlet-bois.com/",
    title: "Un site sur mesure au service du savoir-faire bois",
    description:
      "Nous avons conçu un site web moderne et fonctionnel pour Charlet Bois, spécialiste de la fabrication sur mesure en bois pour les professionnels et les particuliers. Grâce à une interface épurée et responsive, les visiteurs peuvent facilement découvrir l'étendue des services proposés et entrer en contact avec l'entreprise",
  },
  {
    id: "3",
    imageUrl: imageMaisonCharlet,
    companyName: "Maison Charlet",
    companyLogoUrl: logoMaisonCharlet,
    siteUrl: "https://www.maisoncharlet.com/",
    title: "Une vitrine digitale pour l'excellence artisanale",
    description:
      "Nous avons conçu un site web élégant et immersif pour Maison Charlet, fabricant de mobilier en bois sur mesure depuis 1948. Ce site met en lumière leur savoir-faire artisanal, leur engagement éthique et la durabilité de leurs créations. Grâce à une interface épurée et responsive, les visiteurs peuvent découvrir l'histoire de l'entreprise, explorer leurs réalisations et entrer en contact facilement. Le design reflète l'authenticité et la qualité intemporelle des meubles signés Maison Charlet",
  },
];


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: LinksEnum.SitesEtWebApps,
        element: <WebAppComponent />,
      },
      {
        path: LinksEnum.SiteSurMesure,
        element: <SiteWebSurMesure/>
      },
      {
        path: LinksEnum.ExperienceUtilisateur,
        element: <ExperienceUtilisateur/>
      },
      {
        path: LinksEnum.ResponsiveDesign,
        element: <ResponsiveDesign/>
      },
      {
        path: LinksEnum.ApplicationsMobiles,
        element: <ApplicationMobile/>
      },
      {
        path: LinksEnum.CampagnesSEA,
        element: <CampagneSEA/>
      },
      {
        path: LinksEnum.Branding,
        element: <Branding/>
      }
    ],
  },
  {
    path: LinksEnum.Contact,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ContactUs />,
      }
    ]
  },
  {
    path: LinksEnum.Projets,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ProjectShowcase projects={dummyProjects} />,
      }
    ]
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
