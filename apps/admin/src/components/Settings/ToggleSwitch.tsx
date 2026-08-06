// Toggle Switch Component
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <div
        className={`peer h-6 w-11 rounded-full transition-colors duration-300 ease-in-out ${checked ? "bg-(--gold-crayola)" : "bg-(--eerie-black-4)"} ${disabled ? "cursor-not-allowed opacity-50" : ""} peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:duration-300 after:ease-in-out after:content-[''] ${checked ? "after:translate-x-full after:border-white" : ""} `}
      />
    </label>
  );
};

export default ToggleSwitch;
