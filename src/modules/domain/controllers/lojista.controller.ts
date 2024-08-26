import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LojistaService } from '../application/services/lojista.service';
import { Lojista } from '../entities/lojista.entity';
import { CreateLojistaDto } from '../application/dto/createLojista.dto';

@Controller('lojistas')
export class LojistaController {
  constructor(private readonly lojistaService: LojistaService) {}

  @Get('getAllLojistas')
  findAll(): Promise<Lojista[]> {
    return this.lojistaService.findAll();
  }
  @Get('getLojistaById/:id')
  async getUserById(@Param('id') id: string) {
    return await this.lojistaService.getLojistaById(id);
  }

  /*@Post('createData')
  create(@Body() lojista: Lojista): Promise<Lojista> {
    return this.lojistaService.create(lojista);
  }*/
  @Post('createuser')
  async create(@Body() createlojistaDto: CreateLojistaDto): Promise<Lojista> {
    return await this.lojistaService.create(createlojistaDto);
  }
}
