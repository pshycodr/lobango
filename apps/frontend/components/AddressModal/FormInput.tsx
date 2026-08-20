import React, { type ChangeEvent } from "react";

export interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  className?: string;
}

export function FormInput({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  error,
  className = "",
}: FormInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-white">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border bg-gray-800 p-3 ${
          error ? "border-red-500" : "border-gray-600"
        } text-white placeholder-gray-400 transition-colors duration-200 focus:border-yellow-500 focus:outline-none`}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}
