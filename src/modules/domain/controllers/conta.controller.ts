import {
  Controller,
  Post,
  Body,
  Param,
  HttpStatus,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ContaService } from '../application/services/conta.service';
import { AdicionarSaldoDto } from '../application/dto/adicionarSaldo.dto';

@Controller('contas')
export class ContaController {
  constructor(private readonly contaService: ContaService) {}

  @Post(':id/receber-transferencia')
  receberTransferencia(
    @Param('id') id: number,
    @Body('valor') valor: number,
  ): Promise<void> {
    return this.contaService.receberTransferencia(id, valor);
  }

  @Post(':id/fazer-transferencia')
  fazerTransferencia(
    @Param('id') id: number,
    @Body('valor') valor: number,
  ): Promise<void> {
    return this.contaService.fazerTransferencia(id, valor);
  }
  @Post('adicionar-saldo')
  async adicionarSaldo(@Body() adicionarSaldoDto: AdicionarSaldoDto) {
    await this.contaService.adicionarSaldo(adicionarSaldoDto);
    return { message: 'Saldo adicionado com sucesso!' };
  }
  @Delete('delete-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll(): Promise<{ message: string }> {
    return this.contaService.deleteAll();
  }
}
