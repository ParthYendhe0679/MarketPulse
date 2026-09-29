import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'yellow' | 'green' | 'pink' | 'blue' | 'orange' | 'red' | 'dark' | 'white';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'yellow' }) => {
  const variantStyles = {
    yellow: 'bg-[#FFD54A] text-[#111111]',
    green: 'bg-[#6EE7B7] text-[#111111]',
    pink: 'bg-[#FF9ECF] text-[#111111]',
    blue: 'bg-[#4F7DF9] text-white',
    orange: 'bg-[#FFB347] text-[#111111]',
    red: 'bg-[#FF6B6B] text-white',
    dark: 'bg-[#111111] text-white',
    white: 'bg-white text-[#111111]'
  };

  return (
    <span className={`inline-block px-3 py-1 font-bold text-xs uppercase tracking-wider border-2 border-[#111111] rounded-full shadow-[1.5px_1.5px_0px_0px_#111111] ${variantStyles[variant]}`}>
      {children}
    </span>
  );
};
