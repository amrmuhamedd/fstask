import React, { useState, useEffect } from 'react';

interface CancelOrderModalProps {
  isOpen: boolean;
  orderId: number | null;
  onClose: () => void;
  onCancel: (orderId: number, refund: boolean) => Promise<void>;
  error: string | null;
}

export default function CancelOrderModal({
  isOpen,
  orderId,
  onClose,
  onCancel,
  error,
}: CancelOrderModalProps) {
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [availableAmount, setAvailableAmount] = useState<string | null>(null);
  const [requiredAmount, setRequiredAmount] = useState<string | null>(null);

  // Parse error message for insufficient balance details
  useEffect(() => {
    if (error) {
      // Check if error relates to insufficient balance
      const isInsufficient = error.toLowerCase().includes('insufficient');
      setIsInsufficientBalance(isInsufficient);
      
      // Try to extract available and required amounts from the message
      if (isInsufficient) {
        const availableMatch = error.match(/Available:\s\$(\d+\.\d+)/i);
        const requiredMatch = error.match(/Required:\s\$(\d+\.\d+)/i);
        
        setAvailableAmount(availableMatch ? availableMatch[1] : null);
        setRequiredAmount(requiredMatch ? requiredMatch[1] : null);
      }
    } else {
      setIsInsufficientBalance(false);
      setAvailableAmount(null);
      setRequiredAmount(null);
    }
  }, [error]);

  if (!isOpen || orderId === null) return null;

  const handleCancel = async (refund: boolean) => {
    if (orderId) {
      await onCancel(orderId, refund);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Order</h3>
        <p className="text-gray-600 mb-6">How would you like to cancel this order?</p>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-1 text-sm text-red-700">
                  {isInsufficientBalance ? (
                    <>
                      <p className="font-semibold">Insufficient Balance</p>
                      <div className="mt-2 p-2 bg-red-100 rounded">
                        <div className="flex justify-between">
                          <span>Available:</span>
                          <span className="font-medium">${availableAmount}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>Required:</span>
                          <span className="font-medium">${requiredAmount}</span>
                        </div>
                      </div>
                      <p className="mt-2 font-medium text-red-800">Please try cancelling without a refund instead.</p>
                      {/* Add arrow pointing to the no-refund option */}
                      <div className="mt-3 flex justify-center">
                        <svg className="h-8 w-8 text-red-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <p className="whitespace-pre-wrap">{error}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => handleCancel(true)}
            disabled={isInsufficientBalance}
            className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center ${isInsufficientBalance 
              ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
              : 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {isInsufficientBalance 
              ? 'Insufficient Balance for Refund' 
              : 'Cancel with refund'}
          </button>
          
          <button
            onClick={() => handleCancel(false)}
            className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center ${isInsufficientBalance 
              ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md transition-colors' 
              : 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-300 transition-colors'}`}
          >
            {isInsufficientBalance ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
            Cancel without refund
            {isInsufficientBalance && (
              <span className="ml-2 bg-white text-green-800 text-xs font-bold px-2 py-0.5 rounded-full">
                Recommended
              </span>
            )}
          </button>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
