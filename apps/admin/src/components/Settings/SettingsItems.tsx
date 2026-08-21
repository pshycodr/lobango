import { Download, Loader2 } from "lucide-react";
import React from "react";
import ToggleSwitch from "./ToggleSwitch";

export interface SettingItemProps {
  title: string;
  description: string;
  type: "toggle" | "action";
  checked?: boolean;
  onToggle?: (checked: boolean) => void;
  onAction?: () => void;
  icon?: React.ReactNode;
  showBorder?: boolean;
  loading?: boolean;
}

export function SettingItem({
  title,
  description,
  type,
  checked = false,
  onToggle,
  onAction,
  icon,
  showBorder = true,
  loading = false,
}: SettingItemProps) {
  return (
    <div
      className={`flex items-center justify-between px-1 py-4 ${
        showBorder ? "border-b border-(--eerie-black-4)" : ""
      } ${
        type === "action" && !loading
          ? "hover:bg-opacity-30 -mx-1 cursor-pointer rounded-lg transition-colors duration-200 hover:bg-(--eerie-black-4)"
          : ""
      } `}
      onClick={type === "action" && !loading ? onAction : undefined}
    >
      <div className="flex items-center gap-3">
        {icon && <div className="text-(--gold-crayola)">{icon}</div>}
        <div>
          <p className="text-sm font-medium text-(--white) md:text-base">
            {title}
          </p>
          <p className="mt-1 text-xs text-(--quick-silver) md:text-sm">
            {description}
          </p>
        </div>
      </div>

      {type === "toggle" && (
        <ToggleSwitch checked={checked} onChange={onToggle || (() => {})} />
      )}

      {type === "action" && (
        <div className="text-(--white)">
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Download size={20} />
          )}
        </div>
      )}
    </div>
  );
}

export default SettingItem;
