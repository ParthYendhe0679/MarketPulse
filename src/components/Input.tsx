import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold font-display uppercase mb-1.5 text-[#111111]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-[#111111] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`w-full py-2.5 ${icon ? 'pl-11' : 'pl-4'} pr-4 bg-white border-3 border-[#111111] rounded-xl font-medium text-[#111111] placeholder-gray-500 shadow-[3px_3px_0px_0px_#111111] transition-all duration-200 focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_#4F7DF9] ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};
