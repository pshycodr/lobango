import React from "react";

export interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
}

export function SectionHeader({ title, icon }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {icon && <div className="text-(--gold-crayola)">{icon}</div>}
      <h2 className="text-xl font-semibold text-(--gold-crayola) md:text-2xl">
        {title}
      </h2>
    </div>
  );
}

export default SectionHeader;
