import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  Delete,
  NotFoundException,
} from '@nestjs/common';
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
  @Delete('delete-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll(): Promise<{ message: string }> {
    return this.lojistaService.deleteAll();
  }
  @Post('createuser')
  async create(
    @Body() createlojistaDto: CreateLojistaDto,
  ): Promise<{ message: string; lojista: Lojista }> {
    return await this.lojistaService.create(createlojistaDto);
  }
}
