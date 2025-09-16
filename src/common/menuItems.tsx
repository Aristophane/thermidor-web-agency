import { MenuItem } from "../components/SlidingMenu";
import LinksEnum from "./linksEnum";

export const menuItems : MenuItem[] = [
    { label: "Service",  url: LinksEnum.Service },
    { label: "Projets"  , url: LinksEnum.Projets },
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