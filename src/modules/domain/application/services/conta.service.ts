import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ContaUsuario } from '../../entities/contaUsuario.entity';
import { ContaLojista } from '../../entities/contaLojista.entity';
import { AdicionarSaldoDto } from '../dto/adicionarSaldo.dto';
import { CreateLojistaDto } from '../dto/createLojista.dto';
import { CreateUsuarioDto } from '../dto/createUsuario.dto';

@Injectable()
export class ContaService {
  constructor(
    @InjectRepository(ContaUsuario)
    private readonly contaUsuarioRepository: MongoRepository<ContaUsuario>,
    @InjectRepository(ContaLojista)
    private readonly contaLojistaRepository: MongoRepository<ContaLojista>,
  ) {}

  async saveConta(
    conta: ContaUsuario | ContaLojista,
    dto: CreateUsuarioDto | CreateLojistaDto,
  ): Promise<ContaUsuario | ContaLojista> {
    if (conta instanceof ContaUsuario) {
      // Atribuir CPF
      conta.cpf = (dto as CreateUsuarioDto).cpf;
      return await this.contaUsuarioRepository.save(conta);
    } else if (conta instanceof ContaLojista) {
      // Atribuir CNPJ
      conta.cnpj = (dto as CreateLojistaDto).cnpj;
      return await this.contaLojistaRepository.save(conta);
    }
  }

  async deleteAll(): Promise<{ message: string }> {
    const resultUsuario = await this.contaUsuarioRepository.deleteMany({});
    const resultLojista = await this.contaLojistaRepository.deleteMany({});

    if (resultUsuario.deletedCount === 0 && resultLojista.deletedCount === 0) {
      throw new NotFoundException('Nenhuma conta encontrada para deletar');
    } else {
      return { message: 'Todas as contas foram deletadas com sucesso' };
    }
  }

  async adicionarSaldo(adicionarSaldoDto: AdicionarSaldoDto): Promise<void> {
    const { cpf, cnpj, valor } = adicionarSaldoDto;

    let conta: ContaUsuario | ContaLojista | undefined;

    if (cpf) {
      conta = await this.contaUsuarioRepository.findOne({
        where: { cpf },
      });
    } else if (cnpj) {
      conta = await this.contaLojistaRepository.findOne({
        where: { cnpj },
      });
    }

    if (!conta) {
      throw new NotFoundException('Conta não encontrada');
    }

    conta.saldo += valor;

    if (conta instanceof ContaUsuario) {
      await this.contaUsuarioRepository.save(conta);
    } else if (conta instanceof ContaLojista) {
      await this.contaLojistaRepository.save(conta);
    }
  }
  async transferir(
    cpfPagador: string | null,
    cpfOuCnpjRecebedor: string,
    valor: number,
  ): Promise<{ message: string }> {
    if (valor <= 0) {
      throw new BadRequestException('O valor deve ser maior que zero.');
    }

    // Verificar e processar a conta pagadora, se fornecida
    if (cpfPagador) {
      const contaPagadora = await this.contaUsuarioRepository.findOne({
        where: { cpf: cpfPagador },
      });

      if (!contaPagadora) {
        throw new NotFoundException('Conta pagadora não encontrada.');
      }

      if (!(contaPagadora instanceof ContaUsuario)) {
        throw new ForbiddenException(
          'A conta pagadora não pode fazer transferências.',
        );
      }

      if (contaPagadora.saldo < valor) {
        throw new BadRequestException('Saldo insuficiente.');
      }

      // Subtrair o valor da conta pagadora
      contaPagadora.saldo -= valor;
      await this.saveConta(contaPagadora, {
        cpf: cpfPagador,
        valor,
      } as unknown as CreateUsuarioDto);
    }

    // Encontrar a conta recebedora
    const contaRecebedora =
      (await this.contaUsuarioRepository.findOne({
        where: { cpf: cpfOuCnpjRecebedor },
      })) ||
      (await this.contaLojistaRepository.findOne({
        where: { cnpj: cpfOuCnpjRecebedor },
      }));

    if (!contaRecebedora) {
      throw new NotFoundException('Conta recebedora não encontrada.');
    }

    // Adicionar o valor à conta recebedora
    contaRecebedora.saldo += valor;
    await this.saveConta(contaRecebedora, {
      cpf: cpfOuCnpjRecebedor,
      valor,
    } as unknown as CreateLojistaDto);

    return { message: 'Transferência realizada com sucesso!' };
  }
}
