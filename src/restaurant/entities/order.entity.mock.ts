export enum OrderStatus {
  PAID = 'paid',
  RECEIVED = 'received',
  PREPARING = 'preparing',
  COMPLETED = 'completed',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export class Order {
  id: string;
  description: string[];
  isActive: boolean;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  client: any;
  restaurant: any;
}