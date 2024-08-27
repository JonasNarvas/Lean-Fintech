import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  Delete,
  HttpCode,
} from '@nestjs/common';
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
  @Delete('delete-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll(): Promise<{ message: string }> {
    return this.usuarioService.deleteAll();
  }

  @Get('getUserById/:id')
  async getUserById(@Param('id') id: string) {
    return await this.usuarioService.getUserById(id);
  }
  @Post('createuser')
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<{ message: string; usuario: Usuario }> {
    return await this.usuarioService.create(createUsuarioDto);
  }
}
