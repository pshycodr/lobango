
interface SettingsCardProps {
    children: React.ReactNode;
    className?: string;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ children, className = '' }) => {
    return (
        <div className={`
        bg-[var(--eerie-black-2)] rounded-xl p-4 md:p-6 
        border border-[var(--eerie-black-4)] 
        shadow-lg backdrop-blur-sm
        ${className}
      `}>
            {children}
        </div>
    );
};

export default SettingsCard;