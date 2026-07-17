
const InfoCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    content: string | React.ReactNode;
    className?: string;
}> = ({ icon, title, content, className = "" }) => (
    <div className={`bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3 mb-3">
            <div className="text-[var(--gold-crayola)]">{icon}</div>
            <h3 className="text-[var(--white)] font-medium">{title}</h3>
        </div>
        <div className="text-[var(--quick-silver)]">{content}</div>
    </div>
);


export default InfoCard