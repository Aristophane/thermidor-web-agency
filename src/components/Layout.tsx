import { Outlet, useLocation } from "react-router-dom";
import { menuItems } from "../common/menuItems";
import SlidingMenu from "./SlidingMenu";
import LogoAllPages from "./LogoAllPages";
import ScrollToTop from "../ScrollToTop";

export const Layout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div>
      <SlidingMenu items={menuItems} />
      <ScrollToTop />
      {!isHomePage && <LogoAllPages />}
      <main>
        <Outlet />
      </main>
    </div>
  );
};
