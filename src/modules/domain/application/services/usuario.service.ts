import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findAll(): Promise<Usuario[]> {
    const lojistas = await this.usuarioRepository.find();
    if (lojistas.length === 0) {
      throw new NotFoundException('Não há registro de lojistas para mostrar');
    }
    return lojistas;
  }

  async create(
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<{ message: string; usuario: Usuario }> {
    if (createUsuarioDto.cpf.length < 11) {
      throw new BadRequestException('O CPF deve ter 11 caracteres!');
    }

    const existingUser = await this.usuarioRepository.findOne({
      where: {
        $or: [{ cpf: createUsuarioDto.cpf }, { email: createUsuarioDto.email }],
      },
    });
    if (existingUser) {
      throw new ConflictException('CPF ou e-mail já estão em uso.');
    }

    const usuario = this.usuarioRepository.create(createUsuarioDto);
    await this.usuarioRepository.save(usuario);

    const contaUsuario = new ContaUsuario();
    contaUsuario.saldo = 0;
    contaUsuario.ownerId = usuario._id;
    await this.contaService.saveConta(contaUsuario, createUsuarioDto);

    return { message: 'O usuário foi criado com sucesso!', usuario };
  }

  async deleteAll(): Promise<{ message: string }> {
    const result = await this.usuarioRepository.deleteMany({});
    if (result.deletedCount === 0) {
      throw new NotFoundException('Nenhum usuario encontrado para deletar');
    }
    return { message: 'Usuarios deletados com sucesso!' };
  }
}
