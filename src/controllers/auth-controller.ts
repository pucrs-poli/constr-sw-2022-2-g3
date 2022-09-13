import { Body, Controller, Post, Route } from "tsoa";
import { KeycloakClient } from "../clients/keycloak-client";

export interface LoginRequest {
    client_id: string,
    username: string,
    password: string
}

@Route('/')
export class AuthController extends Controller {
    /**
     * @param login Route to login users
     * @example body  {
     *   "client_id": "grupo3",
     *   "username": "admin",
     *   "password": "a12345678"
     * }
     */
    @Post('/login')
    async login(@Body() body: LoginRequest) {
        const { client_id, username, password } = body;
        const { data, status } = await KeycloakClient.login(client_id, username, password);
        this.setStatus(status);
        return data;
    }
}
