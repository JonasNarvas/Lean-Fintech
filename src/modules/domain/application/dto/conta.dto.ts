/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line prettier/prettier
import { IsString, IsEmail, IsNotEmpty, Length, Matches, IsIn } from 'class-validator';


export class ContaDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['cpf', 'cnpj'], {
    message: 'Identifier type must be either cpf or cnpj',
  })
  identifierType: string;

  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
