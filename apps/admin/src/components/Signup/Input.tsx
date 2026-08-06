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
      <label className="mb-3 block text-sm font-medium text-(--white)">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-(--eerie-black-4) bg-(--eerie-black-2) px-6 py-4 text-(--white) placeholder-(--quick-silver) transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-(--gold-crayola) focus:outline-none"
      />
    </div>
  );
};

export default InputField;
