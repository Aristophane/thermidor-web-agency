import React, { useEffect, useState } from "react";
import "./SlidingMenu.css";
import { Link, useLocation } from "react-router-dom";

export interface MenuItem {
  label: string;
  url?: string;
  submenu?: MenuItem[];
}

interface SlidingMenuProps {
  items: MenuItem[];
}

const SlidingMenu: React.FC<SlidingMenuProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openSubmenus, setOpenSubmenus] = useState<number[]>([]);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
    setOpenSubmenus([]);
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setOpenSubmenus([]);
  };

  const toggleSubmenu = (index: number) => {
    setOpenSubmenus((prevOpenSubmenus) =>
      prevOpenSubmenus.includes(index)
        ? prevOpenSubmenus.filter((i) => i !== index)
        : [...prevOpenSubmenus, index]
    );
  };

  return (
    <div className={`menu-container ${isOpen ? "open" : ""}`}>
      <div className="burger-icon" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
      <div className="menu-items">
        {items.map((item, index) => (
          <div key={index} className="menu-item-wrapper">
            {item.url ? (
              <Link
                to={item.url}
                className="menu-item"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                {item.label}
              </Link>
            ) : (
              <div
                className="menu-item"
                style={{ transitionDelay: `${index * 0.1}s` }}
                onClick={() => item.submenu && toggleSubmenu(index)}
              >
                {item.label}
              </div>
            )}
            {item.submenu && (
              <div
                className={`submenu-container ${
                  openSubmenus.includes(index) ? "open" : ""
                }`}
              >
                <div className="submenu">
                  {item.submenu.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      className="submenu-item"
                      style={{ transitionDelay: `${(subIndex + 1) * 0.1}s` }}
                    >
                      {subItem.url ? (
                        <Link to={subItem.url} className="submenu-link">
                          {subItem.label}
                        </Link>
                      ) : (
                        <div className="submenu-label">{subItem.label}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlidingMenu;
