import { useLocation, useNavigate } from "@tanstack/react-router";
import { Calendar, FileText, Settings } from "lucide-react";

export interface NavigationProps {
  activeRoute?: string;
}

export function Navigation({ activeRoute }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: FileText, label: "Orders", route: "/", key: "orders" },
    { icon: Calendar, label: "Bookings", route: "/bookings", key: "bookings" },
    { icon: Settings, label: "Settings", route: "/settings", key: "settings" },
  ];

  const handleNavigation = (route: string) => {
    navigate({ to: route });
  };

  const isActive = (itemKey: string, route: string) => {
    if (activeRoute) {
      return activeRoute === itemKey;
    }
    return location.pathname.toLowerCase() === route.toLowerCase();
  };

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-(--eerie-black-4) bg-(--smoky-black-2) backdrop-blur-md">
      <div className="safe-area-pb flex items-center justify-around px-4 pt-3 pb-4">
        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          const active = isActive(item.key, item.route);

          return (
            <button
              key={index}
              onClick={() => handleNavigation(item.route)}
              className={`flex flex-col items-center justify-center gap-1 rounded-lg p-2 transition-colors duration-200 ${
                active
                  ? "text-(--gold-crayola)"
                  : "text-(--quick-silver) hover:text-(--gold-crayola) active:scale-95"
              } `}
            >
              <div
                className={`transition-all duration-200 ${active ? "scale-110 transform" : ""} `}
              >
                <IconComponent size={20} />
              </div>
              <span
                className={`text-xs transition-all duration-200 ${active ? "font-medium" : "font-normal"} `}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default Navigation;
