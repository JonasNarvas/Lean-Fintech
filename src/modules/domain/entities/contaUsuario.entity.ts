import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { Conta } from './conta.entity';
import { ObjectId } from 'mongodb';

@Entity()
export class ContaUsuario extends Conta {
  podeFazerTransferencia(): boolean {
    return true;
  }
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  saldo: number;

  @Column()
  ownerId: ObjectId;
}
