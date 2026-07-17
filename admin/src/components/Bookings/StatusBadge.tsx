
interface StatusBadgeProps {
    status: 'pending' | 'accepted' | 'rejected';
    onClick: (e: React.MouseEvent) => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, onClick }) => {
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30';
            case 'accepted':
                return 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30';
            case 'rejected':
                return 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30 hover:bg-gray-500/30';
        }
    };

    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${getStatusStyles(status)} capitalize hover:scale-105 cursor-pointer`}
            title="Click to change status"
        >
            {status}
        </button>
    );
};

export default StatusBadge;