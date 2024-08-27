# Documentação da API

## Sumário

1. [Introdução](#introdução)
2. [Autenticação](#autenticação)
3. [Usuários](#usuários)
   - [Criar Usuário](#criar-usuário)
   - [Listar Usuários](#listar-usuários)
   - [Deletar Usuário](#deletar-usuário)
4. [Lojistas](#lojistas)
   - [Criar Lojista](#criar-lojista)
   - [Listar Lojistas](#listar-lojistas)
   - [Deletar Lojista](#deletar-lojista)
5. [Contas](#contas)
   - [Deletar Contas](#deletar-contas)
6. [Tratamento de Erros](#tratamento-de-erros)

---

## Introdução

Esta API é uma plataforma de pagamento que permite a criação de usuários e lojistas, bem como a gestão de suas contas. A API é construída com NestJS, TypeORM e MongoDB.

## Autenticação

Não há autenticação integrada nesta documentação. Suponha que todas as operações são acessíveis publicamente.

## Usuários

### Criar Usuário

- **Endpoint**: `POST /usuarios/createuser`
- **Descrição**: Cria um novo usuário.
- **Requisição**:

    ```json
    {
      "nomeCompleto": "Nome Completo",
      "cpf": "12345678901",
      "email": "usuario@example.com",
      "senha": "senha123"
    }
    ```

- **Respostas**:
  - **200 OK**:

    ```json
    {
      "message": "Usuário criado com sucesso."
    }
    ```

  - **400 Bad Request**:

    ```json
    {
      "message": "CPF deve ter pelo menos 11 caracteres."
    }
    ```

    ```json
    {
      "message": "CPF ou e-mail já estão em uso."
    }
    ```

### Listar Usuários

- **Endpoint**: `GET /usuarios/getAllUsuarios`
- **Descrição**: Lista todos os usuários.
- **Respostas**:
  - **200 OK**:

    ```json
    [
      {
        "id": "unique_id",
        "nomeCompleto": "Nome Completo",
        "cpf": "12345678901",
        "email": "usuario@example.com"
      }
    ]
    ```

  - **404 Not Found**:

    ```json
    {
      "message": "Não há usuários para mostrar."
    }
    ```

### Deletar Usuário

- **Endpoint**: `DELETE /usuarios/delete-all`
- **Descrição**: Deleta todos os usuários.
- **Respostas**:
  - **200 OK**:

    ```json
    {
      "message": "Usuarios deletados com sucesso!"
    }
    ```

## Lojistas

### Criar Lojista

- **Endpoint**: `POST /lojistas/createuser`
- **Descrição**: Cria um novo lojista.
- **Requisição**:

    ```json
    {
      "nomeCompleto": "Nome Completo",
      "cnpj": "12345678000195",
      "email": "lojista@example.com",
      "senha": "senha123"
    }
    ```

- **Respostas**:
  - **200 OK**:

    ```json
    {
      "message": "Lojista criado com sucesso."
    }
    ```

  - **400 Bad Request**:

    ```json
    {
      "message": "CNPJ deve ter pelo menos 14 caracteres."
    }
    ```

    ```json
    {
      "message": "CPF ou e-mail já estão em uso."
    }
    ```

### Listar Lojistas

- **Endpoint**: `GET /lojistas/getAllLojistas`
- **Descrição**: Lista todos os lojistas.
- **Respostas**:
  - **200 OK**:

    ```json
    [
      {
        "id": "unique_id",
        "nomeCompleto": "Nome Completo",
        "cnpj": "12345678000195",
        "email": "lojista@example.com"
      }
    ]
    ```

  - **404 Not Found**:

    ```json
    {
      "message": "Não há lojistas para mostrar."
    }
    ```

### Deletar Lojista

- **Endpoint**: `DELETE /lojistas/delete-all`
- **Descrição**: Deleta todos os lojisas.
- **Respostas**:
  - **200 OK**:

    ```json
    {
      "message": "Lojistas deletados com sucesso!"
    }
    ```

## Contas`

### Criar Contas
- **Descrição**: As contas são criadas automaticamente com o respectivo CPF ou CNPJ fornecido na hora da criação do Usuário/Lojista. O default para saldo na conta é 0

### Adicionar Saldo
- **Endpoint**: `POST contas/adicionar-saldo`
- **Descrição**: Método criado para adicionar saldo à conta para fins de teste.

## Tratamento de Erros
  - **404 Not Found**: Quando o CPF/CNPJ no body da resposta não é encontrado no banco de dados.

### Transferir Saldo

- **Endpoint**: `POST contas/transferir`
- **Descrição**: Transfere o dinheiro de uma conta para a outra.
- **Respostas**:
  - **200 OK**:
  ```json
  {
    "message": "Transferência realizada com sucesso!"
  }
  ```
## Tratamento de Erros

  - **404 Not Found**: Retornado quando a conta pagadora ou recebedora não é encontrada. Cada um possui sua própria mensagem de erro.
  - **403 Forbidden**: Retornado quando uma conta do tipo Lojista tenta efetuar uma transferência de saldo.
  - **400 Bad Request**: Retornado quando o saldo da conta pagadora é insuficiente.

### Deletar Contas

- **Endpoint**: `DELETE /contas/delete-all`
- **Descrição**: Deleta todas as contas de usuário e de lojista.
- **Respostas**:
  - **200 OK**:

    ```json
    {
      "message": "Todas as contas foram deletadas com sucesso"
    }
    ```

## Tratamento de Erros

- **404 Not Found**: Retornado quando um recurso não é encontrado, como um usuário, lojista ou conta específica.
- **400 Bad Request**: Retornado quando há um erro com a entrada fornecida, como CPF/CNPJ inválido ou já existente.

---
