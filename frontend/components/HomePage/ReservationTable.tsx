'use client';

import { useState } from 'react';
import { User, Calendar as CalenderIcon, Clock, ChevronDown } from 'lucide-react';
import { Forum } from 'next/font/google';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

const forum = Forum({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-forum',
});

const ReservationSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    person: '1-person',
    date: '',
    time: '08:00am',
    message: '',
  });

  // DatePicker state
  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 2);

  const [startDate, setStartDate] = useState<Date | null>(
    formData.date ? new Date(formData.date) : null
  );

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    setStartDate(date);
    setFormData(prev => ({ ...prev, date: date.toISOString().split("T")[0] }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const personOptions = ['1 Person', '2 Person', '3 Person', '4 Person', '5 Person', '6 Person', '7 Person'];
  const timeOptions = [
    '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM',
    '07:00 PM', '07:30 PM',
    '08:00 PM', '08:30 PM',
    '09:00 PM', '09:30 PM',
    '10:00 PM', '10:30 PM',
    '11:00 PM'
  ];
  

  return (
    <section className="relative" id="reserv">
      <div className="container mx-auto px-4">
        <div className="bg-[var(--smoky-black-2)] -mt-[270px] lg:grid lg:grid-cols-[1fr_0.5fr] overflow-hidden">
          {/* Form Left */}
          <form className="p-10 lg:p-16" onSubmit={handleSubmit}>
            <h2 className={`text-3xl text-white ${forum.className} text-center mb-6`}>
              Online Reservation
            </h2>

            <p className="text-center mb-10 text-amber-50">
              Booking request{' '}
              <a href="tel:+919547061233" className="text-[var(--gold-crayola)] underline">
                +919547061233
              </a>{' '}
              or fill out the order form
            </p>

            {/* Name and Phone */}
            <div className="grid gap-5 mb-5 md:grid-cols-2">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-[var(--eerie-black-2)] text-white h-14 px-5 border border-[var(--white-alpha-10)] outline-none transition-colors focus:border-[var(--gold-crayola)] placeholder:text-white"
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-[var(--eerie-black-2)] text-white h-14 px-5 border border-[var(--white-alpha-10)] outline-none transition-colors focus:border-[var(--gold-crayola)] placeholder:text-white"
                required
              />
            </div>

            {/* Person, Date, Time */}
            <div className="grid gap-5 mb-5 md:grid-cols-3 overflow-hidden">
              {/* Person Select */}
              <div className="relative">
                <User className="absolute top-1/2 left-4 -translate-y-1/2 w-4 h-4 pointer-events-none text-[var(--gold-crayola)]" />
                <select
                  name="person"
                  value={formData.person}
                  onChange={handleInputChange}
                  className="bg-[var(--eerie-black-2)] text-white h-14 pl-10 pr-10 border border-[var(--white-alpha-10)] outline-none transition-colors focus:border-[var(--gold-crayola)] w-full appearance-none cursor-pointer"
                >
                  {personOptions.map((option, index) => (
                    <option key={index} value={`${index + 1}-person`}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute top-1/2 right-2.5 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
              </div>

              {/* Date Picker */}
              <div className="relative w-full">
                <CalenderIcon className="absolute z-10 top-1/2 left-4 -translate-y-1/2 w-4 h-4 pointer-events-none text-[var(--gold-crayola)]" />
                <DatePicker
                  selected={startDate}
                  onChange={handleDateChange}
                  minDate={today}
                  maxDate={maxDate}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select date"
                  className="bg-[var(--eerie-black-2)] text-white h-14 pl-10 pr-10 border border-[var(--white-alpha-10)] outline-none transition-colors focus:border-[var(--gold-crayola)] w-xl sm:w-lg lg:w-full  appearance-none cursor-pointer"
                  popperPlacement="bottom-start"
                  calendarClassName="react-datepicker"
                  dayClassName={(date) =>
                    date < today || date > maxDate
                      ? 'react-datepicker__day--disabled'
                      : ''
                  }
                />
              </div>

              {/* Time Select */}
              <div className="relative">
                <Clock className="absolute top-1/2 left-4 -translate-y-1/2 w-4 h-4 pointer-events-none text-[var(--gold-crayola)]" />
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="bg-[var(--eerie-black-2)] text-white h-14 pl-10 pr-10 border border-[var(--white-alpha-10)] outline-none transition-colors focus:border-[var(--gold-crayola)] w-full appearance-none cursor-pointer"
                >
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time.replace(' : ', ':').replace(' ', '').toLowerCase()}>
                      {time}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute top-1/2 right-2.5 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
              </div>
            </div>

            {/* Message */}
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleInputChange}
              className="bg-[var(--eerie-black-2)] text-white h-35 p-5 border border-[var(--white-alpha-10)] outline-none transition-colors focus:border-[var(--gold-crayola)] w-full resize-none leading-none mb-5 placeholder:text-white"
            ></textarea>

            {/* Submit Button */}
            <button
              type="submit"
              className="relative w-full bg-[var(--gold-crayola)] text-black font-bold uppercase tracking-[3px] px-11 py-3 overflow-hidden z-10 transition-all duration-500 hover:text-white group"
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[200%] h-[200%] rounded-full bg-[var(--smoky-black-1)] transition-all duration-500 -z-10 group-hover:bottom-[-50%]"></div>
              <span className="block transition-transform duration-250 group-hover:-translate-y-10">Book A Table</span>
              <span className="absolute top-full left-1/2 -translate-x-1/2 min-w-max text-white transition-all duration-250 group-hover:top-1/2 group-hover:-translate-y-1/2">
                Book A Table
              </span>
            </button>
          </form>

          {/* Form Right */}
          <div
            className="text-center p-10 lg:p-16 bg-repeat bg-top-left"
            style={{ backgroundImage: "url('/assets/images/form-pattern.png')" }}
          >
            <h2 className={`text-3xl sm:text-6xl text-white ${forum.className} text-center mb-10`}>
              Contact Us
            </h2>

            <p className="font-bold mb-1 text-amber-50">Booking Request</p>
            <a
              href="tel:+919547061233"
              className="font-[var(--fontSize-body-1)] text-[var(--gold-crayola)] max-w-max mx-auto block mb-5 transition-colors hover:underline"
            >
              +919547061233
            </a>

            <div className="w-2 h-2 border border-[var(--gold-crayola)] rotate-45 mx-auto my-5 spin-slow"></div>

            <p className="font-bold mb-1 text-amber-50">Location</p>
            <address className="font-[var(--fontSize-body-4)] text-[var(--gold-crayola)] not-italic mb-6">
              BHATAR, PURBO BORDHAMAN, <br />
              WEST BENGAL, IND
            </address>

            <p className="font-bold mb-1 text-amber-50">Lunch Time</p>
            <p className="font-[var(--fontSize-body-4)] text-[var(--quick-silver)] leading-[var(--lineHeight-3)] mb-6">
              Monday to Sunday <br />
              11.30 am - 2.30pm
            </p>

            <p className="font-bold mb-1 text-amber-50">Dinner Time</p>
            <p className="font-[var(--fontSize-body-4)] text-[var(--quick-silver)] leading-[var(--lineHeight-3)]">
              Monday to Sunday <br />
              07.30 pm - 10.00pm
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationSection;
