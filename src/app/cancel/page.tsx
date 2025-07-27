export default function Cancel() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      <h1 className="text-2xl font-bold text-center">Payment Canceled</h1>
      <p className="text-center mt-2">Your payment was canceled. Please try again if you wish to complete the purchase.</p>
      <a href="/" className="text-blue-500 underline mt-4">Return to Home</a>
    </div>
  );
}