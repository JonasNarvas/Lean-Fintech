import { Entity } from 'typeorm';
import { Conta } from './conta.entity';

@Entity()
export class ContaLojista extends Conta {
  podeFazerTransferencia(): boolean {
    return false;
  }
}
