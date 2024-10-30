export interface Client {
  name: string;
  email: string;
  phone: string;
  age: number;
}

export interface Restaurant {
  name: string;
  address: string;
  capacity: number;
  currentClients?: number;
}

export interface Order {
  description: string[];
  isActive?: boolean;
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
  client: Client;
  restaurant: Restaurant;
}

export enum OrderStatus {
  PAID = 'paid',
  RECEIVED = 'received',
  PREPARING = 'preparing',
  COMPLETED = 'completed',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

interface SeedData {
  clients: Client[];
  restaurants: Restaurant[];
  orders: Order[];
}

export const initialData: SeedData = {
  clients: [
    {
      name: 'Alice Smith',
      email: 'alice@example.com',
      phone: '1234567890',
      age: 30,
    },
    {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '0987654321',
      age: 25,
    },
    {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      phone: '5555555555',
      age: 35,
    },
  ],

  restaurants: [
    {
      name: 'Pizza Place',
      address: '123 Pizza St.',
      capacity: 50,
    },
    {
      name: 'Burger Joint',
      address: '456 Burger Ave.',
      capacity: 30,
    },
    {
      name: 'Sushi Spot',
      address: '789 Sushi Rd.',
      capacity: 40,
    },
  ],

  orders: [
    {
      description: ['1x Margherita Pizza', '2x Coke'],
      isActive: true,
      status: OrderStatus.PAID,
      client: {
        name: 'Alice Smith',
        email: 'alice@example.com',
        phone: '1234567890',
        age: 30,
      },
      restaurant: {
        name: 'Pizza Place',
        address: '123 Pizza St.',
        capacity: 50,
      },
    },
    {
      description: ['2x Cheeseburger', '1x Fries'],
      isActive: true,
      status: OrderStatus.RECEIVED,
      client: {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '0987654321',
        age: 25,
      },
      restaurant: {
        name: 'Burger Joint',
        address: '456 Burger Ave.',
        capacity: 30,
      },
    },
    {
      description: ['3x Sushi Rolls'],
      isActive: true,
      status: OrderStatus.PREPARING,
      client: {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        phone: '5555555555',
        age: 35,
      },
      restaurant: {
        name: 'Sushi Spot',
        address: '789 Sushi Rd.',
        capacity: 40,
      },
    },
  ],
};
