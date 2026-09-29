import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'primary' | 'yellow' | 'green' | 'pink' | 'orange' | 'red';
  shadowColor?: 'black' | 'pink' | 'yellow' | 'blue' | 'green' | 'orange';
  hoverable?: boolean;
  borderWidth?: '2' | '3' | '4';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'white',
  shadowColor = 'black',
  hoverable = true,
  borderWidth = '3',
  className = '',
  ...props
}) => {
  const bgStyles = {
    white: 'bg-white text-[#111111]',
    primary: 'bg-[#4F7DF9] text-white',
    yellow: 'bg-[#FFD54A] text-[#111111]',
    green: 'bg-[#6EE7B7] text-[#111111]',
    pink: 'bg-[#FF9ECF] text-[#111111]',
    orange: 'bg-[#FFB347] text-[#111111]',
    red: 'bg-[#FF6B6B] text-white'
  };

  const shadowStyles = {
    black: 'shadow-[4px_4px_0px_0px_#111111]',
    pink: 'shadow-[4px_4px_0px_0px_#FF9ECF]',
    yellow: 'shadow-[4px_4px_0px_0px_#FFD54A]',
    blue: 'shadow-[4px_4px_0px_0px_#4F7DF9]',
    green: 'shadow-[4px_4px_0px_0px_#6EE7B7]',
    orange: 'shadow-[4px_4px_0px_0px_#FFB347]'
  };

  const hoverStyles = hoverable
    ? 'transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#111111]'
    : '';

  const borderStyle = {
    '2': 'border-2 border-[#111111]',
    '3': 'border-3 border-[#111111]',
    '4': 'border-4 border-[#111111]'
  }[borderWidth];

  return (
    <div
      className={`rounded-2xl p-5 ${bgStyles[variant]} ${borderStyle} ${shadowStyles[shadowColor]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
