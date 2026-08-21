import React from "react";

export interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
  className?: string;
}

export function InfoCard({
  icon,
  title,
  content,
  className = "",
}: InfoCardProps) {
  return (
    <div
      className={`rounded-lg border border-(--eerie-black-4) bg-(--eerie-black-2) p-4 ${className}`}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="text-(--gold-crayola)">{icon}</div>
        <h3 className="font-medium text-(--white)">{title}</h3>
      </div>
      <div className="text-(--quick-silver)">{content}</div>
    </div>
  );
}

export default InfoCard;
