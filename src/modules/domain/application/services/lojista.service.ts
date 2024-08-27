import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Lojista } from '../../entities/lojista.entity';
import { ObjectId } from 'mongodb';
import { ContaLojista } from '../../entities/contaLojista.entity';
import { ContaService } from './conta.service';
import { CreateLojistaDto } from '../dto/createLojista.dto';

@Injectable()
export class LojistaService {
  constructor(
    @InjectRepository(Lojista)
    private readonly lojistaRepository: MongoRepository<Lojista>,
    @InjectRepository(ContaLojista)
    private readonly contaLojistaRepository: MongoRepository<ContaLojista>,
    private readonly contaService: ContaService,
  ) {}

  async findAll(): Promise<Lojista[]> {
    const lojistas = await this.lojistaRepository.find();
    if (lojistas.length === 0) {
      throw new NotFoundException('Não há registro de lojistas para mostrar');
    }
    return lojistas;
  }

  async create(
    createLojistaDto: CreateLojistaDto,
  ): Promise<{ message: string; lojista: Lojista }> {
    if (createLojistaDto.cnpj.length < 11) {
      throw new BadRequestException(' O CNPJ deve ter 11 caracteres! ');
    }
    const existingUser = await this.lojistaRepository.findOne({
      where: {
        $or: [
          { cpf: createLojistaDto.cnpj },
          { email: createLojistaDto.email },
        ],
      },
    });
    if (existingUser) {
      throw new ConflictException('CNPJ ou e-mail já estão em uso.');
    }
    const lojista = this.lojistaRepository.create(createLojistaDto);
    await this.lojistaRepository.save(lojista);
    const contaLojista = new ContaLojista();
    contaLojista.saldo = 0;
    contaLojista.ownerId = lojista._id;
    await this.contaService.saveConta(contaLojista);
    return { message: ' O lojista foi criado com sucesso! ', lojista };
  }
  async deleteAll(): Promise<{ message: string }> {
    const result = await this.lojistaRepository.deleteMany({});
    if (result.deletedCount === 0) {
      throw new NotFoundException('Nenhum lojista encontrado para deletar');
    }
    return { message: 'Lojistas deletados com sucesso! ' };
  }

  async getLojistaById(id: string) {
    const _result = await this.lojistaRepository.findOne({
      where: { id: new ObjectId(id) },
    });
    return _result;
  }
}
