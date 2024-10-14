import { Outlet, useLocation } from "react-router-dom";
import { menuItems } from "../common/menuItems";
import SlidingMenu from "./SlidingMenu";
import LogoAllPages from "./LogoAllPages";

export const Layout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div>
      <SlidingMenu items={menuItems} />
      {!isHomePage && <LogoAllPages />}
      <main>
        <Outlet />
      </main>
    </div>
  );
};
