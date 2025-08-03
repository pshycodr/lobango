interface SignInButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

const SignInButton: React.FC<SignInButtonProps> = ({ onClick, disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full py-4 bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] 
                   font-semibold text-lg rounded-lg transition-all duration-300
                   hover:bg-opacity-90 hover:transform hover:scale-[1.02]
                   active:transform active:scale-[0.98]
                   disabled:opacity-50 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-[var(--gold-crayola)] focus:ring-offset-2 focus:ring-offset-[var(--smoky-black-1)]"
        >
            Sign Up
        </button>
    );
};

export default SignInButton;