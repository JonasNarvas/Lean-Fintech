import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContaUsuario } from './entities/contaUsuario.entity';
import { ContaLojista } from './entities/contaLojista.entity';
import { ContaService } from '../domain/application/services/conta.service';
import { ContaController } from '../domain/controllers/conta.controller';
//import { UsuarioModule } from './usuario.module';
//import { LojistaModule } from './lojista.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContaUsuario, ContaLojista]),
    //UsuarioModule,
    //LojistaModule,
  ],
  providers: [ContaService],
  controllers: [ContaController],
  exports: [ContaService, TypeOrmModule],
})
export class ContaModule {}
