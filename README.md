# Constr SW 2022/2 - Grupo 3

## COMO que eu INICIO isso???

### **Docker(keycloak) + Node(api)**

Requisitos:
- Docker
- Node 16+ (certifique-se que o npm está na versão 7 para cima)

Passos para iniciar:
- Instale as dependências `npm i`
- Inicie o keycloak `npm run up:keycloak`
- Inicie a api rest `npm start`
- **Obs**: O import do realm é automático!

Passos para parar:
- Feche o terminal da api rest
- Execute `npm run down:keycloak`

### **Docker com tudo**
Requisitos:
- Docker
- Node (opcional)

Passos para iniciar:
- `docker-compose up -d --build` ou `npm run up:all`

Passos para parar:
- `docker-compose down` ou `npm run down:all`

## COMO que eu USO isso???

Inicie a api rest.

Documentação das rotas com Swagger: [http://127.0.0.1:3000/docs](http://127.0.0.1:3000/docs)

## Erros

- `npm ERR! code EBADENGINE`, solução: Instale a versão correta do node, para facilitar use o [NVM](https://github.com/nvm-sh/nvm).
