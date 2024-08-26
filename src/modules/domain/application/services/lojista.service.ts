import { Injectable } from '@nestjs/common';
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

  findAll(): Promise<Lojista[]> {
    return this.lojistaRepository.find();
  }

  async create(createLojistaDto: CreateLojistaDto): Promise<Lojista> {
    // Criação do Usuario
    const lojista = this.lojistaRepository.create(createLojistaDto);
    await this.lojistaRepository.save(lojista);
    // Criação da ContaUsuario associada
    const contaLojista = new ContaLojista();
    contaLojista.saldo = 0;
    contaLojista.ownerId = lojista._id;
    // Salvar a ContaUsuario
    await this.contaService.saveConta(contaLojista);

    return lojista;
  }

  async getLojistaById(id: string) {
    const _result = await this.lojistaRepository.findOne({
      where: { id: new ObjectId(id) },
    });
    return _result;
  }
}
