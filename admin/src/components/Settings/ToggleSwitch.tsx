// Toggle Switch Component
interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, disabled = false }) => {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
            />
            <div className={`
          w-11 h-6 rounded-full peer transition-colors duration-300 ease-in-out
          ${checked
                    ? 'bg-[var(--gold-crayola)]'
                    : 'bg-[var(--eerie-black-4)]'
                }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          peer-focus:outline-none
          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
          after:bg-white after:border-gray-300 after:border after:rounded-full 
          after:h-5 after:w-5 after:transition-all after:duration-300 after:ease-in-out
          ${checked ? 'after:translate-x-full after:border-white' : ''}
        `} />
        </label>
    );
};

export default ToggleSwitch;