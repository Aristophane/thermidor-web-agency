import { MenuItem } from "../components/SlidingMenu";
import LinksEnum from "./linksEnum";

export const menuItems : MenuItem[] = [
    {
      label: "Services",
      submenu: [
        { label: "Sites Web & Applications", url: LinksEnum.SitesEtWebApps },
        { label: "Campagnes Sponsorisées (SEA, Ads)", url: LinksEnum.CampagnesSEA },
        { label: "Branding & Identité Visuelle", url: LinksEnum.Branding },
      ],
    },
    { label: "Projets" },
    // {
    //   label: "Clients",
    //   submenu: [
    //     { label: "Web Development" },
    //     { label: "SEO" },
    //     { label: "Marketing" },
    //   ],
    // },
    { label: "Contact" , url: LinksEnum.Contact },
  ];