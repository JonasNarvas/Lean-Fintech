import { ObjectId } from 'mongodb';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
//import { UserBase } from './user.entity';

@Entity()
export abstract class Conta {
  @PrimaryGeneratedColumn()
  _id: ObjectId;

  @Column()
  fullName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  saldo: number;

  @Column()
  ownerId: ObjectId;

  abstract podeFazerTransferencia(): boolean;
}
