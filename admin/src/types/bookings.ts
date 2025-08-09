export interface Booking {
    id: number;
    booking_id: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    date: string;
    time: string;
    number_of_people: number;
    occasion?: string;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
}

export interface StatusOption {
    label: string;
    value: 'pending' | 'accepted' | 'rejected';
}

export interface FilterOption {
    label: string;
    value: string;
}

export interface StatusCounts {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
}