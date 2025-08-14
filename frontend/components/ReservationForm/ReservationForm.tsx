import { User, Clock, AlertCircle } from 'lucide-react';
import { Forum } from 'next/font/google';
import { TextInput, SelectInput, DatePickerInput, TextAreaInput } from './FormInputs';
import { SubmitButton } from './SubmitButton';
import { personOptions, personValues, timeOptions, timeValues } from '../../utils/bookingUtils';

const forum = Forum({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-forum',
});

interface ReservationFormProps {
    formData: any;
    startDate: Date | null;
    isSubmitting: boolean;
    isFormValid: boolean;
    isBookingAllowed: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onDateChange: (date: Date | null) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const ReservationForm = ({
    formData,
    startDate,
    isSubmitting,
    isFormValid,
    isBookingAllowed,
    onInputChange,
    onDateChange,
    onSubmit
}: ReservationFormProps) => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 2);

    return (
        <form className="p-10 lg:p-16" onSubmit={onSubmit}>
            {isBookingAllowed === false ? (
                <div className="p-8 text-center text-red-500 text-xl font-semibold flex justify-center items-center gap-3 tracking-tighter border-2 rounded-md border-red-500 mb-5">
                    <p>Bookings are currently closed. Please check back later.</p>
                </div>) : ""}

            <h2 className={`text-3xl text-white ${forum.className} text-center mb-6`}>
                Online Reservation
            </h2>

            <p className="text-center mb-10 text-amber-50">
                Booking request{' '}
                <a href="tel:+916296832453" className="text-[var(--gold-crayola)] underline">
                    +91 6296832453
                </a>{' '}
                or fill out the order form
            </p>

            <div className="grid gap-5 mb-5 md:grid-cols-2">
                <TextInput
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={onInputChange}
                    required
                    disabled={isSubmitting}
                />
                <TextInput
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={onInputChange}
                    type="tel"
                    required
                    disabled={isSubmitting}
                    minLength={10}
                />
            </div>

            <div className="mb-5">
                <TextInput
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={onInputChange}
                    type="email"
                    required
                    disabled={isSubmitting}
                    className="w-full"
                />
            </div>

            <div className="grid gap-5 mb-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <SelectInput
                    name="person"
                    value={formData.person}
                    onChange={onInputChange}
                    options={personOptions}
                    optionValues={personValues}
                    icon={User}
                    disabled={isSubmitting}
                />

                <DatePickerInput
                    selected={startDate}
                    onChange={onDateChange}
                    minDate={today}
                    maxDate={maxDate}
                    disabled={isSubmitting}
                />

                <SelectInput
                    name="time"
                    value={formData.time}
                    onChange={onInputChange}
                    options={timeOptions}
                    optionValues={timeValues}
                    icon={Clock}
                    disabled={isSubmitting}
                />
            </div>

            <TextAreaInput
                name="message"
                placeholder="Special occasion or message (optional)"
                value={formData.message}
                onChange={onInputChange}
                disabled={isSubmitting}
            />

            <SubmitButton
                isSubmitting={isSubmitting}
                isFormValid={isFormValid}
            />
        </form>
    );
};