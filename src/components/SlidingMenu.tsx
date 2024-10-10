import React, { useState } from "react";
import "./SlidingMenu.css";

interface MenuItem {
  label: string;
  submenu?: MenuItem[];
}

interface SlidingMenuProps {
  items: MenuItem[];
}

const SlidingMenu: React.FC<SlidingMenuProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openSubmenus, setOpenSubmenus] = useState<number[]>([]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
            <div
              className="menu-item"
              style={{ transitionDelay: `${index * 0.1}s` }}
              onClick={() => item.submenu && toggleSubmenu(index)}
            >
              {item.label}
            </div>
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
                      {subItem.label}
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
