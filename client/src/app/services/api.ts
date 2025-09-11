// API Service for handling backend communication

// Order type definitions
export interface Order {
  id: number;
  store_id: number;
  customer_id: number;
  store_name: string;
  customer_name: string;
  status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED';
  amount_cents: number;
  created_at: string;
  updated_at: string;
}

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Fetch all orders from the API
 */
export async function fetchOrders(): Promise<Order[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

/**
 * Cancel an order with optional refund
 */
export async function cancelOrder(orderId: number, refund: boolean): Promise<{ id: number; status: string; refunded: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refund }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      // Create a custom error object with additional properties
      const error: any = new Error(errorData?.message || `API error: ${response.statusText}`);
      error.status = response.status;
      error.statusText = response.statusText;
      error.data = errorData;
      
      // For 422 errors, provide more detail if available
      if (response.status === 422 && errorData) {
        error.isInsufficientBalance = errorData.message?.toLowerCase().includes('insufficient');
        error.details = errorData.details;
        // Make the error more user friendly
        if (error.isInsufficientBalance) {
          error.message = 'Insufficient store balance to process this refund';
          if (errorData.details) {
            const { available, required } = errorData.details;
            if (available !== undefined && required !== undefined) {
              error.message += `. Available: ${formatCurrency(available)}, Required: ${formatCurrency(required)}`;
            }
          }
        }
      }
      
      throw error;
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error cancelling order ${orderId}:`, error);
    throw error;
  }
}

// Format currency (cents to dollars/currency)
export function formatCurrency(amountCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountCents / 100);
}
