interface SettingsCardProps {
  children: React.ReactNode;
  className?: string;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`rounded-xl border border-(--eerie-black-4) bg-(--eerie-black-2) p-4 shadow-lg backdrop-blur-sm md:p-6 ${className} `}
    >
      {children}
    </div>
  );
};

export default SettingsCard;
