import { Outlet, useLocation } from "react-router-dom";
import { menuItems } from "../common/menuItems";
import SlidingMenu from "./SlidingMenu";
import LogoAllPages from "./LogoAllPages";
import ScrollToTop from "../ScrollToTop";
import styled from "styled-components";

export const Layout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const Main = styled.main`
    margin-top: 10em;
  `;

  return (
    <div>
      <SlidingMenu items={menuItems} />
      <ScrollToTop />
      {!isHomePage && <LogoAllPages />}
      <Main>
        <Outlet />
      </Main>
    </div>
  );
};
