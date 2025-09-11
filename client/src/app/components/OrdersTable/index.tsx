"use client";

import { Order } from '../../services/api';
import OrderRow from './OrderRow';
import LoadingRow from './LoadingRow';
import EmptyRow from './EmptyRow';

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  formatDate: (date: string) => string;
  onCancelClick: (orderId: number) => void;
}

export default function OrdersTable({ 
  orders, 
  loading, 
  formatDate,
  onCancelClick 
}: OrdersTableProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Order List</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Store
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Loading state */}
            {loading && <LoadingRow />}

            {/* No orders state */}
            {!loading && orders.length === 0 && <EmptyRow />}

            {/* Orders list */}
            {!loading &&
              orders.map((order) => (
                <OrderRow 
                  key={order.id}
                  order={order}
                  formatDate={formatDate}
                  onCancelClick={onCancelClick}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
