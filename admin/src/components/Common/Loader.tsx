
export default function LoadingSpinner() {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative mb-6">
          <div className="w-20 h-20 border-4 border-[var(--white-alpha-20)] rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-[var(--gold-crayola)] rounded-full animate-spin"></div>
          <div className="absolute top-2 left-2 w-16 h-16 border-4 border-transparent border-t-[var(--gold-crayola)] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
  
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-2">
            {/* <span className="text-[var(--gold-crayola)] text-lg font-semibold animate-pulse">Fetching your order</span> */}
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-[var(--gold-crayola)] rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-[var(--gold-crayola)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-[var(--gold-crayola)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
          {/* <p className="text-[var(--quick-silver)] text-sm">Please wait while we get your order details</p> */}
        </div>
  
        <div className="mt-4 w-48 h-1 bg-[var(--white-alpha-10)] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[var(--gold-crayola)] to-yellow-300 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }