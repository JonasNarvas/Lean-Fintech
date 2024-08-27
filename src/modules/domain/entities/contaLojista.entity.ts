import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { Conta } from './conta.entity';
import { ObjectId } from 'mongodb';

@Entity()
export class ContaLojista extends Conta {
  podeFazerTransferencia(): boolean {
    return false;
  }
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  saldo: number;

  @Column()
  ownerId: ObjectId;
}
