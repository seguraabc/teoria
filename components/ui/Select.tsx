
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, children, ...props }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={props.id || props.name} className="mb-2 text-sm font-medium text-gray-400">{label}</label>
      <select
        {...props}
        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
