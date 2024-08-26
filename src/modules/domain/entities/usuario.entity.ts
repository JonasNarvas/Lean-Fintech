import { Entity, Column, Index } from 'typeorm';
import { UserBase } from './user.entity';

@Entity()
export class Usuario extends UserBase {
  @Column()
  @Index({ unique: true })
  cpf: string;

  @Column()
  @Index({ unique: true })
  email: string;

  getIdentifier(): string {
    return this.cpf;
  }
}
