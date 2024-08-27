import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ObjectId } from 'mongodb';

export class AdicionarSaldoDto {
  @IsNotEmpty()
  @Transform(({ value }) => new ObjectId(value))
  contaId: ObjectId;
  @IsNotEmpty()
  @IsNumber()
  valor: number;
}
