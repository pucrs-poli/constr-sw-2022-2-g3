import { Body, Controller, Post, Route } from "tsoa";
import { AuthService, LoginRequest, RefreshRequest } from "../services/auth-service";

@Route('/')
export class AuthController extends Controller {
    /**
     * @param login Route to login users
     * @example body  {
     *   "username": "user",
     *   "password": "pass"
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
