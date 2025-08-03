import { X } from "lucide-react";
import { useState } from "react";
import type { Order } from "../../types/orders";
import StatusBadge from "./OrderStatusBadge";



const StatusUpdateModal: React.FC<{
    currentStatus: Order['status'];
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (newStatus: Order['status']) => void;
}> = ({ currentStatus, isOpen, onClose, onUpdate }) => {
    const [selectedStatus, setSelectedStatus] = useState<Order['status']>(currentStatus);

    const statuses: Array<{ key: Order['status']; label: string; description: string }> = [
        { key: 'pending', label: 'Pending', description: 'Order received, waiting for confirmation' },
        { key: 'accepted', label: 'Accepted', description: 'Order confirmed and being prepared' },
        { key: 'out for delivery', label: 'Out for Delivery', description: 'Order is on the way to customer' },
        { key: 'delivered', label: 'Delivered', description: 'Order successfully delivered' },
        { key: 'rejected', label: 'Rejected', description: 'Order cancelled or rejected' }
    ];

    const handleUpdate = () => {
        onUpdate(selectedStatus);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[var(--black-alpha-80)] z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--eerie-black-1)] rounded-xl border border-[var(--eerie-black-4)] w-full max-w-md">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-[var(--white)]">Update Order Status</h3>
                        <button
                            onClick={onClose}
                            className="text-[var(--quick-silver)] hover:text-[var(--white)] transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-3 mb-6">
                        {statuses.map(status => (
                            <label
                                key={status.key}
                                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedStatus === status.key
                                        ? 'border-[var(--gold-crayola)] bg-[var(--gold-crayola)]/10'
                                        : 'border-[var(--eerie-black-4)] hover:border-[var(--eerie-black-3)]'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="status"
                                    value={status.key}
                                    checked={selectedStatus === status.key}
                                    onChange={(e) => setSelectedStatus(e.target.value as Order['status'])}
                                    className="mt-1 text-[var(--gold-crayola)] focus:ring-[var(--gold-crayola)]"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <StatusBadge status={status.key} />
                                    </div>
                                    <p className="text-[var(--quick-silver)] text-sm">{status.description}</p>
                                </div>
                            </label>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 border border-[var(--eerie-black-4)] rounded-lg text-[var(--quick-silver)] hover:text-[var(--white)] hover:border-[var(--eerie-black-3)] transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            className="flex-1 py-2.5 px-4 bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] rounded-lg font-medium hover:bg-opacity-90 transition-all"
                        >
                            Update Status
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusUpdateModal;