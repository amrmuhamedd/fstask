"use client";

import { Order, formatCurrency } from '../../services/api';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderRowProps {
  order: Order;
  formatDate: (date: string) => string;
  onCancelClick: (orderId: number) => void;
}

export default function OrderRow({ order, formatDate, onCancelClick }: OrderRowProps) {
  return (
    <tr key={order.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {order.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {order.customer_name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {order.store_name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatCurrency(order.amount_cents)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <OrderStatusBadge status={order.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(order.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {order.status !== 'CANCELLED' && (
          <button
            onClick={() => onCancelClick(order.id)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Cancel
          </button>
        )}
      </td>
    </tr>
  );
}
