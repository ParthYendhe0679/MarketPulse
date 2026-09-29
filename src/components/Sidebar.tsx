import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  GitCompare, 
  FileSpreadsheet, 
  Settings,
  ShoppingBag,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "bg-[#4F7DF9]" },
    { to: "/compare", label: "Compare", icon: GitCompare, color: "bg-[#FFD54A]" },
    { to: "/products", label: "Products", icon: ShoppingBag, color: "bg-[#FF9ECF]" },
    { to: "/reports", label: "Reports", icon: FileSpreadsheet, color: "bg-[#6EE7B7]" },
    { to: "/about", label: "About Platform", icon: Compass, color: "bg-[#FFB347]" },
    { to: "/settings", label: "Settings", icon: Settings, color: "bg-gray-400" }
  ];

  // Helper to determine if link is active
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r-4 border-[#111111] pt-24 px-4 flex flex-col justify-between transition-transform duration-300 lg:sticky lg:top-[84px] lg:h-[calc(100vh-84px)] lg:pt-6 lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-4 lg:hidden p-2 border-2 border-[#111111] bg-[#FF6B6B] rounded-lg shadow-[2px_2px_0px_0px_#111111] active:translate-y-[1.5px]"
        >
          <X className="w-5 h-5 stroke-[3] text-white" />
        </button>

        {/* Navigation List */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 block mb-4">
            Navigation Menu
          </span>

          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActiveLink(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose()}
                  className={`
                    flex items-center gap-3.5 px-3 py-3 rounded-xl border-3 font-bold font-display uppercase text-xs tracking-wide transition-all
                    ${active 
                      ? 'bg-white border-[#111111] shadow-[3px_3px_0px_0px_#111111] translate-x-[-1.5px] translate-y-[-1.5px]' 
                      : 'border-transparent text-gray-600 hover:text-[#111111] hover:bg-[#FAFAFA]'
                    }
                  `}
                >
                  <div className={`w-8 h-8 rounded-lg border-2 border-[#111111] flex items-center justify-center text-white ${item.color} shadow-[1.5px_1.5px_0px_0px_#111111]`}>
                    <Icon className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer Info */}
        <div className="border-t-3 border-[#111111] py-4 mt-6 bg-[#6EE7B7]/10 -mx-4 px-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-[#FFD54A] border-2 border-[#111111] rounded-xl flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#111111]">
              IN
            </div>
            <div>
              <p className="text-xs font-black uppercase text-[#111111]">India Database</p>
              <p className="text-[9px] font-bold text-gray-500 uppercase">28 States | 11 Selected</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
