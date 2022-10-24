import { Body, Controller, Post, Route } from "tsoa";
import { AuthService } from "../services/auth-service";

export interface LoginRequest {
    client_id: string,
    username: string,
    password: string
}

export interface RefreshRequest {
    client_id: string,
    refresh_token: string   
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
        return AuthService.login(body);
    }

    @Post('/refresh')
    async refresh(@Body() body: RefreshRequest) {
        return AuthService.refresh(body);
    }
}
