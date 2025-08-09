import { Filter, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import BookingCard from '../components/Bookings/BookingCard';
import FilterDropdown from '../components/Bookings/FilterDropdown';
import StatusChangeModal from '../components/Bookings/StatusModal';
import type { Booking, FilterOption, StatusCounts } from '../types/bookings';
import api from '../lib/axios';

const BookingsAdminPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    useEffect(() => {
        const fetchBookings = async (): Promise<void> => {
            try {
                setLoading(true);
                const response = await api.get('/api/v1/admin/bookings');
                const data = await response.data;
                console.log();

                setBookings(data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    useEffect(() => {
        let filtered = bookings;

        if (statusFilter) {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(booking =>
                booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.booking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredBookings(filtered);
    }, [bookings, statusFilter, searchTerm]);

    const handleCardClick = (booking: Booking): void => {
        console.log('Clicked booking:', booking);
        // Navigate to booking details page or open modal
    };

    const handleStatusClick = (booking: Booking, e: React.MouseEvent): void => {
        e.stopPropagation(); // Prevent card click
        setSelectedBooking(booking);
        setIsStatusModalOpen(true);
    };

    const handleStatusChange = async (bookingId: string, newStatus: 'pending' | 'accepted' | 'rejected') => {
        try {
            console.log(bookingId);
            const res = await api.post('/api/v1/admin/booking/update-status', { booking_id: bookingId, status: newStatus })

            if (!res.data.success) throw new Error;

            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking.booking_id === bookingId
                        ? { ...booking, status: newStatus }
                        : booking
                )
            );
        } catch (error) {
            console.log(error);
            alert("faild to update status. Try again later")

        }
    };

    const getStatusCounts = (): StatusCounts => {
        return {
            total: bookings.length,
            pending: bookings.filter(b => b.status === 'pending').length,
            accepted: bookings.filter(b => b.status === 'accepted').length,
            rejected: bookings.filter(b => b.status === 'rejected').length,
        };
    };

    const statusCounts = getStatusCounts();

    const statusOptions: FilterOption[] = [
        { label: 'Pending', value: 'pending' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Rejected', value: 'rejected' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--smoky-black-1)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--gold-crayola)] mx-auto mb-4"></div>
                    <p className="text-[var(--white)]">Loading bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--smoky-black-1)] text-[var(--white)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--white)] mb-2">
                        Table Bookings
                    </h1>
                    <p className="text-[var(--quick-silver)]">
                        Manage and track restaurant table reservations
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-xl p-4">
                        <div className="text-2xl font-bold text-[var(--white)] mb-1">{statusCounts.total}</div>
                        <div className="text-sm text-[var(--quick-silver)]">Total Bookings</div>
                    </div>
                    <div className="bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-xl p-4">
                        <div className="text-2xl font-bold text-yellow-400 mb-1">{statusCounts.pending}</div>
                        <div className="text-sm text-[var(--quick-silver)]">Pending</div>
                    </div>
                    <div className="bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-xl p-4">
                        <div className="text-2xl font-bold text-green-400 mb-1">{statusCounts.accepted}</div>
                        <div className="text-sm text-[var(--quick-silver)]">Accepted</div>
                    </div>
                    <div className="bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-xl p-4">
                        <div className="text-2xl font-bold text-red-400 mb-1">{statusCounts.rejected}</div>
                        <div className="text-sm text-[var(--quick-silver)]">Rejected</div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--quick-silver)]" />
                            <input
                                type="text"
                                placeholder="Search by name, booking ID, or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-lg text-[var(--white)] placeholder-[var(--quick-silver)] focus:outline-none focus:border-[var(--gold-crayola)]/50 focus:ring-1 focus:ring-[var(--gold-crayola)]/50"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <FilterDropdown
                            label="Status"
                            options={statusOptions}
                            value={statusFilter ? statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) : ''}
                            onChange={setStatusFilter}
                            icon={Filter}
                        />
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-[var(--quick-silver)] text-sm">
                        Showing {filteredBookings.length} of {bookings.length} bookings
                    </p>
                </div>

                {/* Bookings Grid */}
                {filteredBookings.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-[var(--quick-silver)] text-lg mb-4">No bookings found</div>
                        <p className="text-[var(--quick-silver)]/70 text-sm">
                            {bookings.length === 0
                                ? "There are no bookings to display."
                                : "Try adjusting your filters or search terms."
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onClick={handleCardClick}
                                onStatusClick={handleStatusClick}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Status Change Modal */}
            <StatusChangeModal
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                booking={selectedBooking}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
};

export default BookingsAdminPage;