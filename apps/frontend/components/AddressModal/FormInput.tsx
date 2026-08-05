import { ChangeEvent } from "react";

interface FormInputProps {
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
      <label className="block text-white text-sm font-medium mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full p-3 rounded-lg bg-gray-800 border ${
          error ? "border-red-500" : "border-gray-600"
        } text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors duration-200`}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}
