import Header from './components/Header';
import OrdersContainer from './components/OrdersContainer';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Orders" />
      <OrdersContainer />
    </div>
  );
}
