import { ObjectId } from 'mongodb';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
//import { UserBase } from './user.entity';

@Entity()
export abstract class Conta {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  fullName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  saldo: number;

  //@ManyToOne(() => UserBase)
  //owner: UserBase;
  @Column()
  ownerId: ObjectId;

  abstract podeFazerTransferencia(): boolean;
}
