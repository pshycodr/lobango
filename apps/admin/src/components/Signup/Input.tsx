interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  placeholder,
  value,
  required = false,
  onChange,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-[var(--white)] text-sm font-medium mb-3">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-6 py-4 bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] 
                     rounded-lg text-[var(--white)] placeholder-[var(--quick-silver)] 
                     focus:outline-none focus:ring-2 focus:ring-[var(--gold-crayola)] 
                     focus:border-transparent transition-all duration-300"
      />
    </div>
  );
};

export default InputField;
