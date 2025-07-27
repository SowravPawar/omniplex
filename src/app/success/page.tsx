export default function Success() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      <h1 className="text-2xl font-bold text-center">Payment Successful!</h1>
      <p className="text-center mt-2">Thank you for your purchase. Your payment was processed successfully.</p>
      <a href="/" className="text-blue-500 underline mt-4">Return to Home</a>
    </div>
  );
}