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
    path: "/contact",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ContactUs />,
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
