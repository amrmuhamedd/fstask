interface ErrorAlertProps {
  message: string | null;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 text-red-700 p-4 mb-4 rounded-md">
      <p>{message}</p>
    </div>
  );
}
