import React from "react";

export interface SettingsCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SettingsCard({ children, className = "" }: SettingsCardProps) {
  return (
    <div
      className={`rounded-xl border border-(--eerie-black-4) bg-(--eerie-black-2) p-4 shadow-lg backdrop-blur-sm md:p-6 ${className} `}
    >
      {children}
    </div>
  );
}

export default SettingsCard;
