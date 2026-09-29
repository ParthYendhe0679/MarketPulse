import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'yellow' | 'green' | 'pink' | 'orange' | 'red' | 'dark' | 'white';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'neo-btn select-none font-bold outline-none active:scale-[0.98]';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-lg border-2 shadow-[2px_2px_0px_0px_#111111] hover:shadow-[3px_3px_0px_0px_#111111] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#111111]',
    md: 'px-5 py-2.5 text-base border-3 shadow-[4px_4px_0px_0px_#111111] hover:shadow-[6px_6px_0px_0px_#111111] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#111111]',
    lg: 'px-7 py-3 text-lg border-4 shadow-[6px_6px_0px_0px_#111111] hover:shadow-[8px_8px_0px_0px_#111111] hover:translate-x-[-3px] hover:translate-y-[-3px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[3px_3px_0px_0px_#111111]'
  };

  const variantStyles = {
    primary: 'bg-[#4F7DF9] text-white hover:bg-[#3D6CE5]',
    yellow: 'bg-[#FFD54A] text-[#111111] hover:bg-[#EAC037]',
    green: 'bg-[#6EE7B7] text-[#111111] hover:bg-[#5CD6A6]',
    pink: 'bg-[#FF9ECF] text-[#111111] hover:bg-[#EB8DBE]',
    orange: 'bg-[#FFB347] text-[#111111] hover:bg-[#E99E33]',
    red: 'bg-[#FF6B6B] text-white hover:bg-[#EB5757]',
    dark: 'bg-[#111111] text-white hover:bg-[#222222]',
    white: 'bg-white text-[#111111] hover:bg-[#FAFAFA]'
  };

  const widthStyle = fullWidth ? 'w-full flex' : 'inline-flex';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
