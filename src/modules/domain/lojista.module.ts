import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LojistaService } from './application/services/lojista.service';
import { LojistaController } from './controllers/lojista.controller';
import { Lojista } from './entities/lojista.entity';
import { ContaModule } from './conta.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lojista]), ContaModule],
  providers: [LojistaService],
  controllers: [LojistaController],
  exports: [LojistaService],
})
export class LojistaModule {}
