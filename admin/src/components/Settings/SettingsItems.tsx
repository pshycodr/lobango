import { Download, Loader2 } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";

interface SettingItemProps {
    title: string;
    description: string;
    type: 'toggle' | 'action';
    checked?: boolean;
    onToggle?: (checked: boolean) => void;
    onAction?: () => void;
    icon?: React.ReactNode;
    showBorder?: boolean;
    loading?: boolean; // ← added
}

const SettingItem: React.FC<SettingItemProps> = ({
    title,
    description,
    type,
    checked = false,
    onToggle,
    onAction,
    icon,
    showBorder = true,
    loading = false // ← default false
}) => {
    return (
        <div
            className={`
                flex items-center justify-between py-4 px-1
                ${showBorder ? 'border-b border-[var(--eerie-black-4)]' : ''}
                ${type === 'action' && !loading ? 'cursor-pointer hover:bg-[var(--eerie-black-4)] hover:bg-opacity-30 rounded-lg transition-colors duration-200 -mx-1' : ''}
            `}
            onClick={type === 'action' && !loading ? onAction : undefined}
        >
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="text-[var(--gold-crayola)]">
                        {icon}
                    </div>
                )}
                <div>
                    <p className="text-[var(--white)] font-medium text-sm md:text-base">{title}</p>
                    <p className="text-[var(--quick-silver)] text-xs md:text-sm mt-1">{description}</p>
                </div>
            </div>

            {type === 'toggle' && (
                <ToggleSwitch
                    checked={checked}
                    onChange={onToggle || (() => { })}
                />
            )}

            {type === 'action' && (
                <div className="text-[var(--white)]">
                    {loading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <Download size={20} />
                    )}
                </div>
            )}
        </div>
    );
};

export default SettingItem;
