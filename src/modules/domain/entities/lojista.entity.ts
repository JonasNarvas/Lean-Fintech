import { Entity, Column, Index } from 'typeorm';
import { UserBase } from './user.entity';

@Entity()
export class Lojista extends UserBase {
  @Column()
  @Index({ unique: true })
  cnpj: string;

  @Column()
  @Index({ unique: true })
  email: string;

  getIdentifier(): string {
    return this.cnpj;
  }
}
