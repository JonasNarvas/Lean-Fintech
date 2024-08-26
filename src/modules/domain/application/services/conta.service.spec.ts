import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContaService } from './conta.service';
import { ContaUsuario } from '../../entities/contaUsuario.entity';
import { ContaLojista } from '../../entities/contaLojista.entity';
import { Logger } from '@nestjs/common';

describe('ContaService', () => {
  let service: ContaService;
  let contaUsuarioRepository: Repository<ContaUsuario>;
  let contaLojistaRepository: Repository<ContaLojista>;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContaService,
        {
          provide: getRepositoryToken(ContaUsuario),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ContaLojista),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ContaService>(ContaService);
    contaUsuarioRepository = module.get<Repository<ContaUsuario>>(
      getRepositoryToken(ContaUsuario),
    );
    contaLojistaRepository = module.get<Repository<ContaLojista>>(
      getRepositoryToken(ContaLojista),
    );
    logger = new Logger('TestLogger');
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(contaUsuarioRepository).toBeDefined();
    expect(contaLojistaRepository).toBeDefined();
  });

  it('deve criar uma conta de usuário', async () => {
    const contaUsuario = new ContaUsuario();
    contaUsuario.saldo = 100;

    jest.spyOn(contaUsuarioRepository, 'save').mockResolvedValue(contaUsuario);

    const result = await service.saveConta(contaUsuario);
    console.log('Conta de usuário criada:', result);
    logger.log(`Conta de usuário criada: ${JSON.stringify(result)}`);
    expect(result).toEqual(contaUsuario);
    expect(result.saldo).toBe(100);
  });

  it('deve criar uma conta de lojista', async () => {
    const contaLojista = new ContaLojista();
    contaLojista.saldo = 200;

    jest.spyOn(contaLojistaRepository, 'save').mockResolvedValue(contaLojista);

    const result = await service.saveConta(contaLojista);
    console.log('Conta de lojista criada:', result);
    logger.log(`Conta de lojista criada: ${JSON.stringify(result)}`);
    expect(result).toEqual(contaLojista);
    expect(result.saldo).toBe(200);
  });
});
