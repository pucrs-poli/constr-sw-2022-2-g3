import { KeycloakClient } from "../clients/keycloak-client";
import { UnauthorizedError } from "../errors/unauthorized-error";

export interface LoginRequest {
    username: string,
    password: string
}

export interface RefreshRequest {
    refresh_token: string   
}

export class AuthService {
    static async login(loginRequest: LoginRequest) {
        const { username, password } = loginRequest;
        const { data, status } = await KeycloakClient.login(username, password);
        if (status === 401) throw new UnauthorizedError();
        return data;
    }

    static async refresh(refreshRequest: RefreshRequest) {
        const { refresh_token} = refreshRequest;
        const { data, status } = await KeycloakClient.refresh(refresh_token);
        if (status === 401) throw new UnauthorizedError();
        return data;
    }
}
