import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export abstract class UserBase {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  abstract getIdentifier(): string;
}
