export const SubmitButton = ({
    isSubmitting,
    isFormValid
}: {
    isSubmitting: boolean;
    isFormValid: boolean;
}) => (
    <button
        type="submit"
        disabled={isSubmitting || !isFormValid}
        className={`relative w-full font-bold uppercase tracking-[3px] px-11 py-3 overflow-hidden z-10 transition-all duration-500 group ${isSubmitting || !isFormValid
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-[var(--gold-crayola)] text-black hover:text-white'
            }`}
    >
        {!isSubmitting && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[200%] h-[200%] rounded-full bg-[var(--smoky-black-1)] transition-all duration-500 -z-10 group-hover:bottom-[-50%]"></div>
        )}
        <span className={`block transition-transform duration-250 ${isSubmitting ? '' : 'group-hover:-translate-y-10'}`}>
            {isSubmitting ? 'Booking...' : 'Book A Table'}
        </span>
        {!isSubmitting && (
            <span className="absolute top-full left-1/2 -translate-x-1/2 min-w-max text-white transition-all duration-250 group-hover:top-1/2 group-hover:-translate-y-1/2">
                Book A Table
            </span>
        )}
    </button>
);