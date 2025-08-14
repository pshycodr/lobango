import LoadingSpinner from '@/components/common/LoadingSpinner';

interface CheckoutLoadingScreenProps {
    message: string;
}

export function CheckoutLoadingScreen({ message }: CheckoutLoadingScreenProps) {
    return (
        <div className="min-h-screen bg-[var(--smoky-black-1)] flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner />
                <p className="text-white mt-4">{message}</p>
            </div>
        </div>
    );
}