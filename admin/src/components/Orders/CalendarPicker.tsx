import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

interface CalendarPickerProps {
    selectedDate: string | null;
    onDateSelect: (date: string | null) => void;
    onClose: () => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({ 
    selectedDate, 
    onDateSelect, 
    onClose 
}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        
        // Previous month's trailing days
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const day = new Date(year, month, -i);
            days.push({ date: day, isCurrentMonth: false });
        }
        
        // Current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({ date: new Date(year, month, day), isCurrentMonth: true });
        }
        
        // Next month's leading days
        const totalCells = Math.ceil(days.length / 7) * 7;
        let nextMonthDay = 1;
        while (days.length < totalCells) {
            days.push({ date: new Date(year, month + 1, nextMonthDay), isCurrentMonth: false });
            nextMonthDay++;
        }
        
        return days;
    };

    const formatDateForComparison = (date: Date) => {
        // Use local date to avoid timezone issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const days = getDaysInMonth(currentMonth);
    const today = new Date();

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
            return newMonth;
        });
    };

    const handleDateClick = (date: Date) => {
        const dateStr = formatDateForComparison(date);
        if (selectedDate === dateStr) {
            onDateSelect(null); 
        } else {
            onDateSelect(dateStr);
        }
        onClose(); 
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md shadow-2xl mx-auto my-auto max-h-screen overflow-y-auto">
                {/* Scrollable content container */}
                <div className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-[var(--white)] font-semibold text-lg sm:text-xl">Select Date</h3>
                        <button
                            onClick={onClose}
                            className="text-[var(--quick-silver)] hover:text-[var(--white)] p-1 sm:p-2 rounded-lg hover:bg-[var(--eerie-black-3)] transition-all touch-manipulation"
                            aria-label="Close calendar"
                        >
                            <X size={18} className="sm:w-5 sm:h-5" />
                        </button>
                    </div>

                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <button
                            onClick={() => navigateMonth('prev')}
                            className="p-2 sm:p-2 text-[var(--quick-silver)] hover:text-[var(--gold-crayola)] rounded-lg hover:bg-[var(--eerie-black-3)] transition-all touch-manipulation"
                            aria-label="Previous month"
                        >
                            <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
                        </button>
                        <span className="text-[var(--white)] font-semibold text-base sm:text-lg text-center px-2">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </span>
                        <button
                            onClick={() => navigateMonth('next')}
                            className="p-2 sm:p-2 text-[var(--quick-silver)] hover:text-[var(--gold-crayola)] rounded-lg hover:bg-[var(--eerie-black-3)] transition-all touch-manipulation"
                            aria-label="Next month"
                        >
                            <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                        </button>
                    </div>

                    {/* Days of Week */}
                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-[var(--quick-silver)] text-xs sm:text-sm font-medium py-2 sm:py-3">
                                <span className="hidden xs:inline">{day}</span>
                                <span className="xs:hidden">{day.charAt(0)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-4 sm:mb-6">
                        {days.map((dayObj, index) => {
                            const dateStr = formatDateForComparison(dayObj.date);
                            const isSelected = selectedDate === dateStr;
                            const isToday = formatDateForComparison(today) === dateStr;
                            const isFutureDate = dayObj.date > today;
                            
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleDateClick(dayObj.date)}
                                    disabled={isFutureDate}
                                    className={`
                                        aspect-square min-h-[40px] sm:min-h-[48px] text-xs sm:text-sm rounded-lg sm:rounded-xl transition-all duration-200 font-medium touch-manipulation active:scale-95
                                        ${!dayObj.isCurrentMonth 
                                            ? 'text-[var(--quick-silver)]/40' 
                                            : isSelected
                                            ? 'bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] shadow-lg scale-105'
                                            : isToday
                                            ? 'bg-[var(--gold-crayola)]/20 text-[var(--gold-crayola)] font-bold border border-[var(--gold-crayola)]/40'
                                            : isFutureDate
                                            ? 'text-[var(--quick-silver)]/30 cursor-not-allowed'
                                            : 'text-[var(--white)] hover:bg-[var(--eerie-black-3)] hover:scale-105 active:bg-[var(--eerie-black-4)]'
                                        }
                                    `}
                                    aria-label={`Select ${dayObj.date.toDateString()}`}
                                >
                                    {dayObj.date.getDate()}
                                </button>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                        <button
                            onClick={() => {
                                onDateSelect(null);
                                onClose();
                            }}
                            className="order-2 xs:order-1 flex-1 py-3 px-4 bg-[var(--eerie-black-3)] text-[var(--quick-silver)] rounded-xl hover:bg-[var(--eerie-black-4)] hover:text-[var(--white)] active:bg-[var(--eerie-black-4)] transition-all font-medium touch-manipulation"
                        >
                            Clear Date
                        </button>
                        <button
                            onClick={onClose}
                            className="order-1 xs:order-2 flex-1 py-3 px-4 bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] rounded-xl hover:bg-[var(--gold-crayola)]/90 active:bg-[var(--gold-crayola)]/80 transition-all font-semibold touch-manipulation"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPicker;