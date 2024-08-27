import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateLojistaDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  cnpj: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;
}
