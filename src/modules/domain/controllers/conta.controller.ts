/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Delete,
  HttpCode,
  HttpException,
  Get,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ContaService } from '../application/services/conta.service';
import { AdicionarSaldoDto } from '../application/dto/adicionarSaldo.dto';
import { ContaLojista } from '../entities/contaLojista.entity';
import { ContaUsuario } from '../entities/contaUsuario.entity';

@Controller('contas')
export class ContaController {
  constructor(private readonly contaService: ContaService) {}

  @Post('transferir')
  async transferir(
    @Body() transferDto: { cpfPagador: string | null; cpfOuCnpjRecebedor: string; valor: number },
  ): Promise<{ message: string }> {
    return await this.contaService.transferir(
      transferDto.cpfPagador,//somente o cpf pois lojista(cnpj) não pode fazer pagamentos
      transferDto.cpfOuCnpjRecebedor,
      transferDto.valor,
    );
  }
  @Post('/adicionar-saldo')
  async adicionarSaldo(
    @Body() adicionarSaldoDto: AdicionarSaldoDto,
  ): Promise<{ message: string }> {
    const { cpf, cnpj, valor } = adicionarSaldoDto;

    if (!cpf && !cnpj) {
      throw new HttpException(
        'CPF ou CNPJ deve ser fornecido',
        HttpStatus.BAD_REQUEST);
      }
  
      if (valor <= 0) {
      throw new HttpException(
        'Valor deve ser positivo',
        HttpStatus.BAD_REQUEST);
      }
  
      try {
        await this.contaService.adicionarSaldo(adicionarSaldoDto);
        return { message: 'Saldo adicionado com sucesso' };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
  @Delete('delete-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll(): Promise<{ message: string }> {
    return this.contaService.deleteAll();
  }
}
