import { MenuItem } from "../components/SlidingMenu";
import LinksEnum from "./linksEnum";

export const menuItems : MenuItem[] = [
    {
      label: "Services",
      submenu: [
        { label: "Sites Web & Applications", url: LinksEnum.SitesEtWebApps },
        { label: "Campagnes Sponsorisées (SEA, Ads)", url: LinksEnum.SitesEtWebApps },
        { label: "UX/UI Design", url: LinksEnum.SitesEtWebApps },
        { label: "Branding & Identité Visuelle", url: LinksEnum.SitesEtWebApps },
      ],
    },
    { label: "Projets" },
    {
      label: "Clients",
      submenu: [
        { label: "Web Development" },
        { label: "SEO" },
        { label: "Marketing" },
      ],
    },
    { label: "Contact" },
  ];