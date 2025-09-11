"use client";

import { useState, useEffect } from 'react';
import { fetchOrders, cancelOrder, Order } from '../services/api';
import { formatDate } from '../utils/dateUtils';
import ErrorAlert from './ErrorAlert';
import OrdersTable from './OrdersTable';
import CancelOrderModal from './CancelOrderModal';

export default function OrdersContainer() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Load orders from API on component mount
  useEffect(() => {
    loadOrders();
  }, []);
  
  // Function to load orders
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders. Please try again later.');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Open cancel modal
  const openCancelModal = (orderId: number) => {
    setSelectedOrderId(orderId);
    setCancelError(null);
    setIsModalOpen(true);
  };

  // Close cancel modal
  const closeCancelModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
    setCancelError(null);
  };

  // Handle cancel order
  const handleCancelOrder = async (orderId: number, refund: boolean) => {
    try {
      setCancelError(null);
      await cancelOrder(orderId, refund);
      await loadOrders(); // Reload orders after successful cancellation
      closeCancelModal();
    } catch (err: any) {
      // Default error message
      let errorMessage = 'Failed to cancel order';
      
      // Handle our enhanced API error objects
      if (err && typeof err === 'object') {
        // Use the message from our error object if available
        if (err.message) {
          errorMessage = err.message;
        }
        
        // Special handling for insufficient balance errors
        if (err.isInsufficientBalance && refund) {
          // We already have a nicely formatted message from the API service
          // Additionally, suggest the user to try without refund
          errorMessage += '\n\nTry cancelling without a refund instead.';
        }
        
        // If we have HTTP status codes, enhance the error with that info
        if (err.status === 422) {
          // 422 is specifically for validation errors like insufficient balance
          console.log('Validation error details:', err.details);
        } else if (err.status === 404) {
          errorMessage = 'Order not found. It may have been already cancelled.';
        } else if (err.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      }
      
      setCancelError(errorMessage);
      console.error('Error cancelling order:', err);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Error message */}
      <ErrorAlert message={error} />
      
      {/* Orders Table */}
      <OrdersTable
        orders={orders}
        loading={loading}
        formatDate={formatDate}
        onCancelClick={openCancelModal}
      />

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={isModalOpen}
        orderId={selectedOrderId}
        onClose={closeCancelModal}
        onCancel={handleCancelOrder}
        error={cancelError}
      />
    </main>
  );
}
