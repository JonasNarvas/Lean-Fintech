import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ContaUsuario } from '../../entities/contaUsuario.entity';
import { ContaLojista } from '../../entities/contaLojista.entity';
import { AdicionarSaldoDto } from '../dto/adicionarSaldo.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ObjectId } from 'mongodb';

@Injectable()
export class ContaService {
  constructor(
    @InjectRepository(ContaUsuario)
    private readonly contaUsuarioRepository: MongoRepository<ContaUsuario>,
    @InjectRepository(ContaLojista)
    private readonly contaLojistaRepository: MongoRepository<ContaLojista>,
  ) {}

  async receberTransferencia(contaId: number, valor: number): Promise<void> {
    const conta =
      (await this.contaUsuarioRepository.findOneBy({ id: contaId })) ||
      (await this.contaLojistaRepository.findOneBy({ id: contaId }));

    if (!conta) {
      throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
    }

    conta.saldo += valor;
    await this.saveConta(conta);
  }

  async fazerTransferencia(contaId: number, valor: number): Promise<void> {
    const conta = await this.contaUsuarioRepository.findOneBy({ id: contaId });

    if (!conta || !conta.podeFazerTransferencia()) {
      throw new HttpException(
        'Esta conta não pode fazer transferências',
        HttpStatus.FORBIDDEN,
      );
    }

    if (conta.saldo < valor) {
      throw new HttpException('Saldo insuficiente', HttpStatus.BAD_REQUEST);
    }

    conta.saldo -= valor;
    await this.saveConta(conta);
  }

  async saveConta(
    conta: ContaUsuario | ContaLojista,
  ): Promise<ContaUsuario | ContaLojista> {
    if (conta instanceof ContaUsuario) {
      return await this.contaUsuarioRepository.save(conta);
    } else if (conta instanceof ContaLojista) {
      return await this.contaLojistaRepository.save(conta);
    }
  }

  async adicionarSaldo(adicionarSaldoDto: AdicionarSaldoDto): Promise<void> {
    const { contaId, valor } = adicionarSaldoDto;
    let conta = await this.contaLojistaRepository.findOne({
      where: { _id: contaId },
    });
    if (!conta) {
      throw new NotFoundException('Conta não encontrada');
    }
    // Adicionar o valor ao saldo da conta
    conta.saldo += valor;

    // Salve a conta atualizada de volta ao banco de dados
    if (conta instanceof ContaUsuario) {
      await this.contaUsuarioRepository.save(conta);
    } else {
      await this.contaLojistaRepository.save(conta);
    }
  }
}
