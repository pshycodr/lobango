import {
    CheckCircle,
    Clock,
    Package,
    Truck,
    XCircle
} from 'lucide-react';
import type { Order } from '../../types/orders';

interface StatusBadgeProps {
    status: Order['status'];
    size?: 'sm' | 'lg',
    onClick: () => void;
    disabled: boolean
}


const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', onClick, disabled }) => {
    const getStatusConfig = (status: Order['status']) => {
        switch (status) {
            case 'pending':
                return {
                    icon: <Clock size={size === 'sm' ? 14 : 18} />,
                    text: 'Pending',
                    bgColor: 'bg-orange-500/20',
                    textColor: 'text-orange-400',
                    borderColor: 'border-orange-500/30'
                };
            case 'accepted':
                return {
                    icon: <CheckCircle size={size === 'sm' ? 14 : 18} />,
                    text: 'Accepted',
                    bgColor: 'bg-blue-500/20',
                    textColor: 'text-blue-400',
                    borderColor: 'border-blue-500/30'
                };
            case 'out for delivery':
                return {
                    icon: <Truck size={size === 'sm' ? 14 : 18} />,
                    text: 'Out for Delivery',
                    bgColor: 'bg-purple-500/20',
                    textColor: 'text-purple-400',
                    borderColor: 'border-purple-500/30'
                };
            case 'delivered':
                return {
                    icon: <Package size={size === 'sm' ? 14 : 18} />,
                    text: 'Delivered',
                    bgColor: 'bg-green-500/20',
                    textColor: 'text-green-400',
                    borderColor: 'border-green-500/30'
                };
            case 'rejected':
                return {
                    icon: <XCircle size={size === 'sm' ? 14 : 18} />,
                    text: 'Rejected',
                    bgColor: 'bg-red-500/20',
                    textColor: 'text-red-400',
                    borderColor: 'border-red-500/30'
                };
            default:
                return {
                    icon: <Clock size={size === 'sm' ? 14 : 18} />,
                    text: 'Unknown',
                    bgColor: 'bg-gray-500/20',
                    textColor: 'text-gray-400',
                    borderColor: 'border-gray-500/30'
                };
        }
    };

    const config = getStatusConfig(status);
    const padding = size === 'sm' ? 'px-3 py-1.5' : 'px-4 py-2';
    const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

    return (
        <button className={`inline-flex items-center gap-2 ${padding} rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${textSize} font-medium`} onClick={onClick} disabled={disabled}>
            {config.icon}
            {config.text}
        </button>
    );
};


export default StatusBadge;