export interface OrderWithRelations {
  id: number;
  store_id: number;
  customer_id: number;
  store_name: string;
  customer_name: string;
  status: string;
  amount_cents: number;
  created_at: Date;
  updated_at: Date;
}

export interface IOrderRepository {
  findOrdersWithRelations(): Promise<OrderWithRelations[]>;
}
