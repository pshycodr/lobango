import { Calendar as CalenderIcon, ChevronDown } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const TextInput = ({
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
  disabled = false,
  minLength,
  className = "",
}: {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  minLength?: number;
  className?: string;
}) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`bg-[var(--eerie-black-2)] text-white h-14 px-5 border border-[var(--white-alpha-10)] outline-none transition-colors focus:border-[var(--gold-crayola)] placeholder:text-white ${className}`}
    required={required}
    disabled={disabled}
    minLength={minLength}
  />
);

export const SelectInput = ({
  name,
  value,
  onChange,
  options,
  optionValues,
  icon: Icon,
  disabled = false,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  optionValues: string[];
  icon: any;
  disabled?: boolean;
}) => (
  <div className="relative">
    <Icon className="absolute top-1/2 left-4 -translate-y-1/2 w-4 h-4 pointer-events-none text-[var(--gold-crayola)]" />
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="bg-[var(--eerie-black-2)] text-white h-14 pl-10 pr-10 border border-[var(--white-alpha-10)] outline-none transition-colors focus:border-[var(--gold-crayola)] w-full appearance-none cursor-pointer"
      disabled={disabled}
    >
      {options.map((option, index) => (
        <option key={index} value={optionValues[index]}>
          {option}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute top-1/2 right-2.5 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
  </div>
);

export const DatePickerInput = ({
  selected,
  onChange,
  minDate,
  maxDate,
  disabled = false,
}: {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate: Date;
  maxDate: Date;
  disabled?: boolean;
}) => (
  <div className="relative min-w-full">
    <CalenderIcon className="absolute z-10 top-1/2 left-4 -translate-y-1/2 w-4 h-4 pointer-events-none text-[var(--gold-crayola)]" />
    <DatePicker
      selected={selected}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      dateFormat="dd-MM-yyyy"
      placeholderText="Select date"
      className="!w-full bg-[var(--eerie-black-2)] text-white h-14 pl-12 pr-10 border border-[var(--white-alpha-10)] outline-none transition-colors focus:border-[var(--gold-crayola)] appearance-none cursor-pointer"
      popperPlacement="bottom-start"
      calendarClassName="react-datepicker custom-datepicker"
      dayClassName={(date) =>
        date < minDate || date > maxDate
          ? "react-datepicker__day--disabled"
          : ""
      }
      disabled={disabled}
      required
    />
  </div>
);

export const TextAreaInput = ({
  name,
  placeholder,
  value,
  onChange,
  disabled = false,
}: {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}) => (
  <textarea
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="bg-[var(--eerie-black-2)] text-white h-35 p-5 border border-[var(--white-alpha-10)] outline-none transition-colors focus:border-[var(--gold-crayola)] w-full resize-none leading-none mb-5 placeholder:text-white"
    disabled={disabled}
  />
);
