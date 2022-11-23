# Constr SW 2022/2 - Grupo 3

## Uso

Requisitos:
- Docker
- Node 16+ (certifique-se que o npm está na versão 7 para cima)

### Antes de subir a aplicação

`npm run up:network` (cria a rede constr-sw-2022-2)
`npm run up:volumes` (cria os volumes do postgresql e keycloak)

### Subir toda a aplicação

Subir toda aplicação (keycloak, keycloak-api, reservations-api)

`npm run up`

### Subir módulos específicos

Subir isoladamente a keycloak-api

`npm run up -- keycloak keycloak-api`

Subir isoladamente a reservations-api

`npm run up -- postgresql reservations-api`

## Sub-módulos (backends dos outros grupos)

### Inicializar sub-módulos

`npm run submodules:init`

### Atualizar sub-módulos

`npm run submodules:update`

## Documentação

Documentação das rotas com Swagger (keycloak-api): [http://127.0.0.1:3000/docs](http://127.0.0.1:3000/docs)
Documentação das rotas com Swagger (reservations-api): [http://127.0.0.1:3001/docs](http://127.0.0.1:3001/docs)

## Testes

Recomenda-se executá-los, pois eles inserem um usuário novo `user`:`pass` e alguns dados de reservas.

`npm t`

Foram feitos testes de integração para checar se o fluxo principal ocorre corretamente, é possível observálo no `Actions` rodando a cada push.

Fluxo principal:
- Login como admin (admin-cli)
- Criar usuário
- Atualizar senha do usuário
- Logar como usuário de teste
- Pegar lista de reservas
- Criar reserva
- Tentar criar reserva com conflito
- Tentar atualizar reserva com conflito
- Atualizar reserva
- Pegar reserva por id

## Erros

- `npm ERR! code EBADENGINE`, solução: Instale a versão correta do node, para facilitar use o [NVM](https://github.com/nvm-sh/nvm).
