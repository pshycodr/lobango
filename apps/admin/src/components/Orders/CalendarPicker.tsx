import { X, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

interface CalendarPickerProps {
  selectedDate: string | null;
  onDateSelect: (date: string | null) => void;
  onClose: () => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  selectedDate,
  onDateSelect,
  onClose,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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
      days.push({
        date: new Date(year, month + 1, nextMonthDay),
        isCurrentMonth: false,
      });
      nextMonthDay++;
    }

    return days;
  };

  const formatDateForComparison = (date: Date) => {
    // Use local date to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date();

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-4">
      <div className="mx-auto my-auto max-h-screen w-full max-w-xs overflow-y-auto rounded-2xl border border-(--eerie-black-4) bg-(--eerie-black-2) shadow-2xl sm:max-w-sm md:max-w-md">
        {/* Scrollable content container */}
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <h3 className="text-lg font-semibold text-(--white) sm:text-xl">
              Select Date
            </h3>
            <button
              onClick={onClose}
              className="touch-manipulation rounded-lg p-1 text-(--quick-silver) transition-all hover:bg-(--eerie-black-3) hover:text-(--white) sm:p-2"
              aria-label="Close calendar"
            >
              <X size={18} className="sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Month Navigation */}
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <button
              onClick={() => navigateMonth("prev")}
              className="touch-manipulation rounded-lg p-2 text-(--quick-silver) transition-all hover:bg-(--eerie-black-3) hover:text-(--gold-crayola) sm:p-2"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} className="sm:h-5 sm:w-5" />
            </button>
            <span className="px-2 text-center text-base font-semibold text-(--white) sm:text-lg">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              onClick={() => navigateMonth("next")}
              className="touch-manipulation rounded-lg p-2 text-(--quick-silver) transition-all hover:bg-(--eerie-black-3) hover:text-(--gold-crayola) sm:p-2"
              aria-label="Next month"
            >
              <ChevronRight size={18} className="sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="mb-2 grid grid-cols-7 gap-0.5 sm:mb-3 sm:gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-medium text-(--quick-silver) sm:py-3 sm:text-sm"
              >
                <span className="xs:inline hidden">{day}</span>
                <span className="xs:hidden">{day.charAt(0)}</span>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="mb-4 grid grid-cols-7 gap-0.5 sm:mb-6 sm:gap-1">
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
                  className={`aspect-square min-h-[40px] touch-manipulation rounded-lg text-xs font-medium transition-all duration-200 active:scale-95 sm:min-h-[48px] sm:rounded-xl sm:text-sm ${
                    !dayObj.isCurrentMonth
                      ? "text-(--quick-silver)/40"
                      : isSelected
                        ? "scale-105 bg-(--gold-crayola) text-(--smoky-black-1) shadow-lg"
                        : isToday
                          ? "border border-(--gold-crayola)/40 bg-(--gold-crayola)/20 font-bold text-(--gold-crayola)"
                          : isFutureDate
                            ? "cursor-not-allowed text-(--quick-silver)/30"
                            : "text-(--white) hover:scale-105 hover:bg-(--eerie-black-3) active:bg-(--eerie-black-4)"
                  } `}
                  aria-label={`Select ${dayObj.date.toDateString()}`}
                >
                  {dayObj.date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="xs:flex-row flex flex-col gap-2 sm:gap-3">
            <button
              onClick={() => {
                onDateSelect(null);
                onClose();
              }}
              className="xs:order-1 order-2 flex-1 touch-manipulation rounded-xl bg-(--eerie-black-3) px-4 py-3 font-medium text-(--quick-silver) transition-all hover:bg-(--eerie-black-4) hover:text-(--white) active:bg-(--eerie-black-4)"
            >
              Clear Date
            </button>
            <button
              onClick={onClose}
              className="xs:order-2 order-1 flex-1 touch-manipulation rounded-xl bg-(--gold-crayola) px-4 py-3 font-semibold text-(--smoky-black-1) transition-all hover:bg-(--gold-crayola)/90 active:bg-(--gold-crayola)/80"
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
