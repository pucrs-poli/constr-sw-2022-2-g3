import { Express, Request, Router } from 'express';
import { KeycloakClient } from './keycloak-client';

export const router = Router();

let token: string;

const extractToken = (req: Request) => token;//req.headers.get('Authorization');

router.get('/login', async (_, res) => {
    const req = {body: { client_id: 'grupo3', username: 'admin', password: 'a12345678' }}
    const { client_id, username, password } = req.body;
    const { data, status } = await KeycloakClient.login(client_id, username, password);
    token = data.access_token; // TODO: Remover linha apenas
    res.status(status).json(data);
});

/*
POST {{base-api-url}}/users: criação de um usuário
Headers
Authorization: Bearer {{access_token}}
Request body
Documento JSON representando o novo usuário
Response body
Documento JSON representando o novo usuário, incluindo o id gerado automaticamente
Lógica
Consumir a rota do Keycloak que cria um novo usuário
Response codes
201: created
???
*/

// TODO: Alterar create-user para users e usar POST
router.get('/create-user', async (req, res, next) => {
    const { data, status } = await KeycloakClient.createUser(extractToken(req), req.body);
    res.status(status).json(data);
});

router.get('/users', async (req, res, next) => {
    const { data, status } = await KeycloakClient.getUsers(extractToken(req));
    res.status(status).json(data);
});

router.get('/users/:id', async (req, res, next) => {
    const { data, status } = await KeycloakClient.getUserById(extractToken(req), req.params.id);
    res.status(status).json(data);
});

/*
PUT /users/{{id}}: atualização de um usuário
Headers
Authorization: Bearer {{access_token}}
Request body
Documento JSON representando os novos valores dos atributos do usuário
Response boby
Vazio
Lógica
Consumir a rota do Keycloak que atualiza um usuário (método PUT)
Response codes
200: OK
404: Not found: o objeto requisitado não foi localizado
*/
router.put('/users/:id', (req, res, next) => {});

/*
DELETE /users/{{id}}: exclusão lógica de um usuário
Headers
Authorization: Bearer {{access_token}}
Request body
Vazio
Response boby
Vazio
Lógica
Desabilitar um usuário consumindo a rota do Keycloak que executa essa alteração
Response codes
204: No content
404: Not found: o objeto requisitado não foi localizado
*/
router.delete('/users/:id', (req, res, next) => {});

/*
PATCH /users/{{id}}: atualização da senha de um usuário
Headers
Authorization: Bearer {{access_token}}
Request body
Documento JSON representando o novo valor do atributo "password"
Response body
Vazio
Lógica
Consumir a rota do Keycloak que atualiza um usuário (método PATCH)
Response codes
200: OK
404: Not found: o objeto requisitado não foi localizado
*/
router.patch('/users/:id', (req, res, next) => {});    
