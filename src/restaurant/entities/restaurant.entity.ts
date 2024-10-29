import { Order } from 'src/order/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'restaurants' })
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  capacity: number;

  @Column({ default: 0 })
  currentClients: number;

  @OneToMany(() => Order, (order) => order.restaurant, { lazy: true })
  orders: Order[];
}
