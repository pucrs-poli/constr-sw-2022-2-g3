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

// FIXME: method: "POST", route: "/users"
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

// FIXME: method: "PUT", route: "/users/:id"
router.get('/users/update/:id', async (req, res, next) => {
    console.log(1)
    const body = { firstName: 'kkkkkkn' }// req.body;
    const { data, status } = await KeycloakClient.updateUserById(extractToken(req), req.params.id, body);
    res.status(status).json(data);
});

// FIXME: method: "DELETE", route: "/users/:id"
router.get('/users/delete/:id', async (req, res, next) => {
    const { data, status } = await KeycloakClient.deleteUserById(extractToken(req), req.params.id);
    res.status(status).json(data);
});

// FIXME: method: "PATCH", route: "/users/:id"
router.get('/users/pass/:id', async (req, res, next) => {
    const body = { password: 'blablabla' }// req.body;
    const { data, status } = await KeycloakClient.setUserPassword(extractToken(req), req.params.id, body);
    res.status(status).json(data);
});    
