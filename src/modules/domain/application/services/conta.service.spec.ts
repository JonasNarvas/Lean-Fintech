import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContaService } from './conta.service';
import { ContaUsuario } from '../../entities/contaUsuario.entity';
import { ContaLojista } from '../../entities/contaLojista.entity';
import { CreateUsuarioDto } from '../dto/createusuario.dto';
import * as fs from 'fs';

describe('ContaService', () => {
  let service: ContaService;
  let contaUsuarioRepository: Repository<ContaUsuario>;
  let contaLojistaRepository: Repository<ContaLojista>;
  const logFilePath = 'logs.txt';

  const logToFile = (message: string) => {
    fs.appendFileSync(
      logFilePath,
      `${new Date().toISOString()} - ${message}\n`,
    );
  };

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
  });

  describe('saveConta', () => {
    it('deve salvar uma conta de usuário com sucesso', async () => {
      const usuarioDto: CreateUsuarioDto = {
        fullName: 'Usuário Teste',
        cpf: '12345678901', // CPF válido
        email: 'usuario@example.com',
        password: 'senha123',
      };

      const contaUsuario = new ContaUsuario();
      Object.assign(contaUsuario, usuarioDto);

      jest
        .spyOn(contaUsuarioRepository, 'save')
        .mockResolvedValue(contaUsuario);

      const result = await service.saveConta(contaUsuario);

      expect(result).toEqual(contaUsuario);
      expect(contaUsuarioRepository.save).toHaveBeenCalledWith(contaUsuario);
      logToFile('Conta de usuário criada com sucesso.');
    });

    it('deve salvar uma conta de lojista com sucesso', async () => {
      const lojistaDto: CreateUsuarioDto = {
        fullName: 'Lojista Teste',
        cpf: '12345678000195', // CPF válido (vale para o CNPJ também)
        email: 'lojista@example.com',
        password: 'senha123',
      };

      const contaLojista = new ContaLojista();
      Object.assign(contaLojista, lojistaDto);

      jest
        .spyOn(contaLojistaRepository, 'save')
        .mockResolvedValue(contaLojista);

      const result = await service.saveConta(contaLojista);

      expect(result).toEqual(contaLojista);
      expect(contaLojistaRepository.save).toHaveBeenCalledWith(contaLojista);
    });

    it('deve lançar um erro ao tentar salvar uma conta de usuário com CPF inválido', async () => {
      const usuarioDto: CreateUsuarioDto = {
        fullName: 'Usuário Teste',
        cpf: '1234567', // CPF inválido
        email: 'usuario@example.com',
        password: 'senha123',
      };

      const contaUsuario = new ContaUsuario();
      Object.assign(contaUsuario, usuarioDto);

      jest.spyOn(contaUsuarioRepository, 'save').mockImplementation(() => {
        throw new Error('CPF inválido');
      });

      try {
        await service.saveConta(contaUsuario);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toContain('CPF inválido');
        logToFile('Erro ao criar conta de usuário: CPF inválido.');
      }
    });

    it('deve lançar um erro ao tentar salvar uma conta com email duplicado', async () => {
      const usuarioDto: CreateUsuarioDto = {
        fullName: 'Usuário Teste',
        cpf: '12345678901',
        email: 'usuario@example.com',
        password: 'senha123',
      };

      const contaUsuario = new ContaUsuario();
      Object.assign(contaUsuario, usuarioDto);

      jest.spyOn(contaUsuarioRepository, 'save').mockImplementation(() => {
        throw new Error('Email já em uso');
      });

      try {
        await service.saveConta(contaUsuario);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toContain('Email já em uso');
        logToFile('Erro ao criar conta de usuário: Email já em uso.');
      }
    });
  });
});
