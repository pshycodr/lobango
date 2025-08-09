import { useLocation, useNavigate } from "@tanstack/react-router";
import { Calendar, FileText, Home, Settings } from "lucide-react";

interface NavigationProps {
  activeRoute?: string;
}

const Navigation: React.FC<NavigationProps> = ({ activeRoute }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', route: '/', key: 'home' },
    { icon: FileText, label: 'Orders', route: '/orders', key: 'orders' },
    { icon: Calendar, label: 'Bookings', route: '/bookings', key: 'bookings' },
    { icon: Settings, label: 'Settings', route: '/settings', key: 'settings' },
  ];

  const handleNavigation = (route: string) => {
    navigate({ to: route });
  };

  const isActive = (itemKey: string, route: string) => {
    if (activeRoute) {
      return activeRoute === itemKey;
    }
    return location.pathname === route;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--smoky-black-2)] backdrop-blur-md border-t border-[var(--eerie-black-4)] md:hidden z-50">
      <div className="flex justify-around items-center px-4 pt-3 pb-4 safe-area-pb">
        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          const active = isActive(item.key, item.route);
          
          return (
            <button
              key={index}
              onClick={() => handleNavigation(item.route)}
              className={`
                flex flex-col items-center justify-center gap-1 transition-colors duration-200 p-2 rounded-lg
                ${active
                  ? 'text-[var(--gold-crayola)]'
                  : 'text-[var(--quick-silver)] hover:text-[var(--gold-crayola)] active:scale-95'
                }
              `}
            >
              <div className={`
                transition-all duration-200
                ${active ? 'transform scale-110' : ''}
              `}>
                <IconComponent size={20} />
              </div>
              <span className={`
                text-xs transition-all duration-200
                ${active ? 'font-medium' : 'font-normal'}
              `}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;