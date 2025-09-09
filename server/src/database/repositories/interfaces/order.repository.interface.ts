import { OrderEntity } from "@/database/entities/order.entity";
import { OrderStatus } from "@/database/enums/order-status.enum";

export interface OrderWithRelations {
  id: number;
  store_id: number;
  customer_id: number;
  store_name: string;
  customer_name: string;
  status: OrderStatus;
  amount_cents: number;
  created_at: Date;
  updated_at: Date;
}

export interface IOrderRepository {
  findOrdersWithRelations(): Promise<OrderWithRelations[]>;
  findOrderById(id: number): Promise<OrderEntity | null>;
  saveOrder(order: OrderEntity): Promise<OrderEntity>;
}
