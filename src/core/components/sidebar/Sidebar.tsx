// core/components/sidebar/Sidebar.tsx
import { useState, useEffect, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getMenuConfig } from './config/menuConfig';
import './Sidebar.css';

interface SubMenuItem {
  text: string;
  href: string;
  icon?: string;
}

interface MenuItem {
  id: string;
  icon: string;
  text: string;
  href?: string;
  submenu?: SubMenuItem[];
  badge?: number;
  onclick?: () => void;
}

const Sidebar = () => {
  const config = getMenuConfig();
  const { header, profileItem } = config;
  const mainItems = config.mainItems as MenuItem[];
  const bottomItems = config.bottomItems as MenuItem[];
  const [isOpen, setIsOpen] = useState(false);
  const [manualToggles, setManualToggles] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);

      // En desktop, mantener el menú abierto
      if (width >= 1200) {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calcular menús expandidos automáticamente basado en la ruta actual
  const autoExpandedMenus = useMemo(() => {
    const expanded = new Set<string>();
    const currentPath = location.pathname;

    mainItems?.forEach(item => {
      if (item.submenu) {
        const hasActiveSubitem = item.submenu.some(
          subitem => subitem.href && currentPath.startsWith(subitem.href)
        );
        if (hasActiveSubitem || (item.href && currentPath.startsWith(item.href))) {
          expanded.add(item.id);
        }
      }
    });

    return expanded;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Verificar si un menú está expandido (auto o manual)
  const isMenuExpanded = (menuId: string) => {
    return autoExpandedMenus.has(menuId) || manualToggles.has(menuId);
  };

  // Toggle submenu manual
  const toggleSubmenu = (menuId: string) => {
    setManualToggles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  // Manejar click en item con submenu o onclick
  const handleItemClick = (item: MenuItem, e: React.MouseEvent) => {
    if (item.onclick) {
      e.preventDefault();
      item.onclick();
      return;
    }

    if (item.submenu && item.submenu.length > 0) {
      e.preventDefault();
      toggleSubmenu(item.id);
      return;
    }

    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Renderizar items del menú
  const renderMenuItem = (item: MenuItem) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = isMenuExpanded(item.id);

    // Si tiene submenu o onclick, usar button/div en lugar de NavLink
    if (hasSubmenu || item.onclick) {
      return (
        <div key={item.id} className="menu-item-wrapper">
          <button
            type="button"
            className="menu-item"
            onClick={(e) => handleItemClick(item, e)}
          >
            <i className={item.icon}></i>
            <span className="menu-item-text">{item.text}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="menu-badge">{item.badge}</span>
            )}
            {hasSubmenu && (
              <i className={`fas fa-chevron-down submenu-arrow ${isExpanded ? 'expanded' : ''}`}></i>
            )}
          </button>

          {hasSubmenu && (
            <div className={`submenu ${isExpanded ? 'active' : ''}`}>
              {item.submenu!.map((subitem, index) => (
                <NavLink
                  key={index}
                  to={subitem.href}
                  className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  {subitem.icon && <i className={subitem.icon}></i>}
                  <span>{subitem.text}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Item normal con navegación
    return (
      <div key={item.id} className="menu-item-wrapper">
        <NavLink
          to={item.href || '#'}
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
          onClick={() => isMobile && setIsOpen(false)}
        >
          <i className={item.icon}></i>
          <span className="menu-item-text">{item.text}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span className="menu-badge">{item.badge}</span>
          )}
        </NavLink>
      </div>
    );
  };

  // Renderizar sección de perfil
  const renderProfile = () => {
    if (!profileItem) return null;

    const isImage = profileItem.avatar.startsWith('http') ||
                   profileItem.avatar.startsWith('/');

    return (
      <NavLink
        to={profileItem.href}
        className={({ isActive }) => `menu-profile-item ${isActive ? 'active' : ''}`}
        onClick={() => isMobile && setIsOpen(false)}
      >
        <div className="profile-avatar">
          {isImage ? (
            <img src={profileItem.avatar} alt={profileItem.name} />
          ) : (
            <span className="avatar-initial">
              {profileItem.avatar}
            </span>
          )}
        </div>
        <div className="profile-info">
          <span className="profile-rol">{profileItem.rol.toUpperCase()}</span>
          <span className="profile-name">{profileItem.name}</span>
        </div>
        <i className="fas fa-chevron-right profile-arrow"></i>
      </NavLink>
    );
  };

  return (
    <>
      {/* Botón hamburguesa */}
      <button 
        className="menu-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Overlay para móvil */}
      {isMobile && isOpen && (
        <div 
          className="overlay active" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
        <div className="menu-header">
          <h2>{header.title}</h2>
          <p>{header.subtitle}</p>
        </div>

        <div className="menu-items">
          <div className="menu-main-items">
            {mainItems.map(renderMenuItem)}
          </div>

          <div className="menu-profile-section">
            {renderProfile()}
          </div>

          {bottomItems.length > 0 && (
            <div className="menu-bottom-items">
              {bottomItems.map(renderMenuItem)}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;