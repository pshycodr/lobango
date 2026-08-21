import React from "react";
import { IonIcon } from "@ionic/react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: string;
  iconPosition?: "left" | "right";
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const baseClasses =
    "font-rubik font-medium rounded-full relative overflow-hidden z-10 transition-colors duration-300";

  const variantClasses = {
    primary: "bg-(--deep-saffron) text-white hover:text-black",
    secondary: "bg-(--dark-orange) text-white hover:text-white",
    outline: "border border-white text-white hover:bg-white hover:text-black",
  };

  const sizeClasses = {
    sm: "px-6 py-2 text-sm h-10",
    md: "px-8 py-2.5 text-base h-12",
    lg: "px-10 py-3 text-lg h-14",
  };

  const hoverEffect =
    variant !== "outline"
      ? `after:content-[''] after:absolute after:bottom-0 after:left-5 after:w-px after:h-px 
       after:bg-rich-black-fogra-29 after:rounded-full after:z-[-1] after:transition-all 
       after:duration-500 hover:after:scale-[500]`
      : "";

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${hoverEffect} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && iconPosition === "left" && (
          <IonIcon icon={icon} className="text-lg" />
        )}
        {children}
        {icon && iconPosition === "right" && (
          <IonIcon icon={icon} className="text-lg" />
        )}
      </span>
    </button>
  );
}
