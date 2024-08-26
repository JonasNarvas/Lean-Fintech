import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Usuario } from '../../entities/usuario.entity';
import { ObjectId } from 'mongodb';
import { ContaUsuario } from '../../entities/contaUsuario.entity';
import { ContaService } from './conta.service';
import { CreateUsuarioDto } from '../dto/createUsuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: MongoRepository<Usuario>,
    @InjectRepository(ContaUsuario)
    private readonly contaUsuarioRepository: MongoRepository<ContaUsuario>,
    private readonly contaService: ContaService,
  ) {}

  findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // Criação do Usuario
    const usuario = this.usuarioRepository.create(createUsuarioDto);
    await this.usuarioRepository.save(usuario);
    // Criação da ContaUsuario associada
    const contaUsuario = new ContaUsuario();
    contaUsuario.saldo = 0;
    contaUsuario.ownerId = usuario._id;
    // Salvar a ContaUsuario
    await this.contaService.saveConta(contaUsuario);

    return usuario;
  }

  async getUserById(id: string) {
    const _result = await this.usuarioRepository.findOne({
      where: { id: new ObjectId(id) },
    });
    return _result;
  }
}
