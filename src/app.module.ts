import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { Usuario } from './modules/domain/entities/usuario.entity';
//import { Lojista } from './modules/domain/entities/lojista.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContaModule } from './modules/domain/conta.module';
import { LojistaModule } from './modules/domain/lojista.module';
import { UsuarioModule } from './modules/domain/usuario.module';
//import { ContaUsuario } from './modules/domain/entities/contaUsuario.entity';
//import { ContaLojista } from './modules/domain/entities/contaLojista.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://root:root@nestjs.d9zns.mongodb.net/?retryWrites=true&w=majority&appName=Nestjs',
      useUnifiedTopology: true,
      synchronize: true, // deixei true por motivos de conveniência
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    //TypeOrmModule.forFeature([Usuario, Lojista]),
    ContaModule,
    LojistaModule,
    UsuarioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
