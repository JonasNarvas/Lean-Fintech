import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class AdicionarSaldoDto {
  @IsNotEmpty()
  @IsNumber()
  autoIncrementId: number;
  @Transform(({ value }) => new ObjectId(value))
  contaId: ObjectId;
  @IsNotEmpty()
  @IsNumber()
  valor: number;
  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  cnpj?: string;
}
