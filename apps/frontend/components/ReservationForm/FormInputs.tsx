import { Calendar as CalenderIcon, ChevronDown } from "lucide-react";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface TextInputProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  minLength?: number;
  className?: string;
}

export function TextInput({
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
  disabled = false,
  minLength,
  className = "",
}: TextInputProps) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`h-14 border border-(--white-alpha-10) bg-(--eerie-black-2) px-5 text-white transition-colors outline-none placeholder:text-white focus:border-(--gold-crayola) ${className}`}
      required={required}
      disabled={disabled}
      minLength={minLength}
    />
  );
}

export interface SelectInputProps {
  name: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  optionValues: string[];
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export function SelectInput({
  name,
  value,
  onChange,
  options,
  optionValues,
  icon: Icon,
  disabled = false,
}: SelectInputProps) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-(--gold-crayola)" />
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="h-14 w-full cursor-pointer appearance-none border border-(--white-alpha-10) bg-(--eerie-black-2) pr-10 pl-10 text-white transition-colors outline-none focus:border-(--gold-crayola)"
        disabled={disabled}
      >
        {options.map((option, index) => (
          <option key={index} value={optionValues[index]}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-white" />
    </div>
  );
}

export interface DatePickerInputProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate: Date;
  maxDate: Date;
  disabled?: boolean;
}

export function DatePickerInput({
  selected,
  onChange,
  minDate,
  maxDate,
  disabled = false,
}: DatePickerInputProps) {
  return (
    <div className="relative min-w-full">
      <CalenderIcon className="pointer-events-none absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2 text-(--gold-crayola)" />
      <DatePicker
        selected={selected}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        dateFormat="dd-MM-yyyy"
        placeholderText="Select date"
        className="h-14 w-full! cursor-pointer appearance-none border border-(--white-alpha-10) bg-(--eerie-black-2) pr-10 pl-12 text-white transition-colors outline-none focus:border-(--gold-crayola)"
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
}

export interface TextAreaInputProps {
  name: string;
  placeholder: string;
  value: string | null;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

export function TextAreaInput({
  name,
  placeholder,
  value,
  onChange,
  disabled = false,
}: TextAreaInputProps) {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value ?? ""}
      onChange={onChange}
      className="mb-5 h-35 w-full resize-none border border-(--white-alpha-10) bg-(--eerie-black-2) p-5 leading-none text-white transition-colors outline-none placeholder:text-white focus:border-(--gold-crayola)"
      disabled={disabled}
    />
  );
}
