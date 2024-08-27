import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContaModule } from './modules/domain/conta.module';
import { LojistaModule } from './modules/domain/lojista.module';
import { UsuarioModule } from './modules/domain/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://root:root@nestjs.d9zns.mongodb.net/?retryWrites=true&w=majority&appName=Nestjs',
      useUnifiedTopology: true,
      synchronize: true, // deixei true por motivos de conveniência
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    ContaModule,
    LojistaModule,
    UsuarioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
