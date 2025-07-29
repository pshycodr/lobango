import './globals.css'


export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body>
        {children}
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </body>
    </html>
  );
}