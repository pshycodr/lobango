export interface SignInButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function SignInButton({ onClick, disabled = false }: SignInButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="hover:bg-opacity-90 w-full rounded-lg bg-(--gold-crayola) py-4 text-lg font-semibold text-(--smoky-black-1) transition-all duration-300 hover:scale-[1.02] hover:transform focus:ring-2 focus:ring-(--gold-crayola) focus:ring-offset-2 focus:ring-offset-(--smoky-black-1) focus:outline-none active:scale-[0.98] active:transform disabled:cursor-not-allowed disabled:opacity-50"
    >
      Sign In
    </button>
  );
}

export default SignInButton;
