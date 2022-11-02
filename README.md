# Constr SW 2022/2 - Grupo 3

## Uso

Requisitos:
- Docker
- Node 16+ (certifique-se que o npm está na versão 7 para cima)

Subir toda aplicação (keycloak, keycloak-api, reservations-api)
```
npm run up
```

Subir keycloak
```
npm run up:keycloak
```

Subir keycloak-api
```
npm run up:keycloak-api
```

Subir reservations-api
```
npm run up:reservations-api
```

## Documentação

Documentação das rotas com Swagger (keycloak-api): [http://127.0.0.1:3000/docs](http://127.0.0.1:3000/docs)
Documentação das rotas com Swagger (reservations-api): [http://127.0.0.1:3001/docs](http://127.0.0.1:3001/docs)

## Erros

- `npm ERR! code EBADENGINE`, solução: Instale a versão correta do node, para facilitar use o [NVM](https://github.com/nvm-sh/nvm).
