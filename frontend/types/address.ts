import { Briefcase, Building2, Home } from "lucide-react";

export interface Address {
    id: string;
    label: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    type: 'home' | 'work' | 'other';
}

export interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectAddress: (address: Address) => void;
    currentAddress?: Address;
}

export const ADDRESS_TYPES = [
    { type: 'home' as const, label: 'Home', icon: Home },
    { type: 'work' as const, label: 'Work', icon: Briefcase },
    { type: 'other' as const, label: 'Other', icon: Building2 }
];