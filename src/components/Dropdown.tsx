import React from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  placeholder,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold font-display uppercase mb-1.5 text-[#111111]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`w-full py-2.5 pl-4 pr-10 bg-white border-3 border-[#111111] rounded-xl font-bold text-sm text-[#111111] appearance-none cursor-pointer shadow-[3px_3px_0px_0px_#111111] transition-all duration-200 focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_#FFD54A] ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#111111]">
          <ChevronDown className="w-5 h-5 stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
};
