import React from "react";

export interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}

export function FormActions({
  onCancel,
  onSubmit,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
}: FormActionsProps) {
  return (
    <div className="flex gap-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 rounded-lg border border-gray-600 p-3 text-gray-400 transition-colors duration-200 hover:bg-gray-800 hover:text-white"
      >
        {cancelLabel}
      </button>
      <button
        type="button"
        onClick={onSubmit}
        className="flex-1 rounded-lg bg-yellow-500 p-3 font-semibold text-black transition-all duration-200 hover:brightness-110"
      >
        {submitLabel}
      </button>
    </div>
  );
}
