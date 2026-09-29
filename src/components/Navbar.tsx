import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Bell, Search, Menu, BarChart3, Sun, Moon, User } from 'lucide-react';
import { Button } from './Button';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/compare", label: "Compare" },
    { to: "/products", label: "Products" },
    { to: "/reports", label: "Reports" },
    { to: "/about", label: "About" }
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white border-b-4 border-[#111111] py-4 px-6 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 border-2 border-[#111111] bg-[#FFD54A] rounded-lg shadow-[2px_2px_0px_0px_#111111] hover:translate-y-[-1px] active:translate-y-[1px]"
        >
          <Menu className="w-5 h-5 stroke-[3] text-[#111111]" />
        </button>

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-[#4F7DF9] border-3 border-[#111111] shadow-[2.5px_2.5px_0px_0px_#111111] rounded-xl flex items-center justify-center transition-all group-hover:-rotate-6">
            <BarChart3 className="w-5 h-5 text-white stroke-[3]" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight text-[#111111] m-0 leading-none">
              MarketPulse<span className="text-[#4F7DF9]">AI</span>
            </h1>
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block leading-none mt-1">
              Market Intelligence
            </span>
          </div>
        </Link>
      </div>

      {/* Nav Links - Desktop */}
      <div className="hidden lg:flex items-center gap-1.5">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `
              px-4 py-2 text-sm font-bold font-display uppercase tracking-wide border-2 border-transparent rounded-xl transition-all
              ${isActive 
                ? 'bg-[#FFD54A] border-[#111111] shadow-[2.5px_2.5px_0px_0px_#111111] translate-x-[-1.5px] translate-y-[-1.5px]' 
                : 'hover:bg-[#FAFAFA] hover:border-gray-200'
              }
            `}
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-3">
        {/* Search - Expandable */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search filters..."
            className="py-1.5 pl-9 pr-4 text-xs font-bold border-2 border-[#111111] rounded-lg shadow-[2px_2px_0px_0px_#111111] focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[3px_3px_0px_0px_#4F7DF9] w-48 transition-all"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 stroke-[2.5]" />
        </div>

        {/* Theme Switcher (Aesthetic) */}
        <button
          onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
          className="w-9 h-9 border-2 border-[#111111] bg-white rounded-lg shadow-[2px_2px_0px_0px_#111111] flex items-center justify-center hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#111111]"
          title="Toggle Theme"
        >
          {theme === 'light' ? (
            <Sun className="w-4.5 h-4.5 stroke-[2.5] text-[#111111]" />
          ) : (
            <Moon className="w-4.5 h-4.5 stroke-[2.5] text-[#111111]" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 border-2 border-[#111111] bg-white rounded-lg shadow-[2px_2px_0px_0px_#111111] flex items-center justify-center hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#111111]">
          <Bell className="w-4.5 h-4.5 stroke-[2.5] text-[#111111]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6B6B] border-2 border-[#111111] rounded-full text-[8px] font-black text-white flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Profile */}
        <Link
          to="/settings"
          className="w-9 h-9 border-2 border-[#111111] bg-[#FF9ECF] rounded-lg shadow-[2px_2px_0px_0px_#111111] flex items-center justify-center hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#111111]"
        >
          <User className="w-4.5 h-4.5 stroke-[2.5] text-[#111111]" />
        </Link>

        {/* Demo Action Button */}
        <Link to="/dashboard" className="hidden sm:inline-flex">
          <Button variant="primary" size="sm">
            Platform Demo
          </Button>
        </Link>
      </div>
    </nav>
  );
};
