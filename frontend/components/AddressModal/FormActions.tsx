interface FormActionsProps {
    onCancel: () => void;
    onSubmit: () => void;
    submitLabel?: string;
    cancelLabel?: string;
  }
  
  export function FormActions({
    onCancel,
    onSubmit,
    submitLabel = 'Submit',
    cancelLabel = 'Cancel'
  }: FormActionsProps) {
    return (
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 p-3 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="flex-1 p-3 rounded-lg bg-yellow-500 text-black font-semibold hover:brightness-110 transition-all duration-200"
        >
          {submitLabel}
        </button>
      </div>
    );
  }