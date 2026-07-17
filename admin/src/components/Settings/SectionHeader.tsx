interface SectionHeaderProps {
    title: string;
    icon?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon }) => {
    return (
        <div className="flex items-center gap-3 mb-4">
            {icon && (
                <div className="text-[var(--gold-crayola)]">
                    {icon}
                </div>
            )}
            <h2 className="text-xl md:text-2xl font-semibold text-[var(--gold-crayola)]">
                {title}
            </h2>
        </div>
    );
};

export default SectionHeader;