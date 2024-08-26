import { Entity } from 'typeorm';
import { Conta } from './conta.entity';

@Entity()
export class ContaUsuario extends Conta {
  podeFazerTransferencia(): boolean {
    return true;
  }
}
