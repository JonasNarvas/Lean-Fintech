import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsuarioService } from '../application/services/usuario.service';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../application/dto/createUsuario.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get('getAllUsers')
  findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @Get('getUserById/:id')
  async getUserById(@Param('id') id: string) {
    return await this.usuarioService.getUserById(id);
  }

  /*@Post('createUser')
  create(@Body() usuario: Usuario): Promise<Usuario> {
    return this.usuarioService.create(usuario);
  }*/
  @Post('createuser')
  async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    return await this.usuarioService.create(createUsuarioDto);
  }
}
