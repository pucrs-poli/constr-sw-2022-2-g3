import { KeycloakClient } from "../clients/keycloak-client";
import { UnauthorizedError } from "../errors/unauthorized-error";

export interface LoginRequest {
    client_id: string,
    username: string,
    password: string
}

export interface RefreshRequest {
    client_id: string,
    refresh_token: string   
}

export class AuthService {
    static async login(loginRequest: LoginRequest) {
        const { client_id, username, password } = loginRequest;
        const { data, status } = await KeycloakClient.login(client_id, username, password);
        if (status === 401) throw new UnauthorizedError();
        return data;
    }

    static async refresh(refreshRequest: RefreshRequest) {
        const { client_id, refresh_token} = refreshRequest;
        const { data, status } = await KeycloakClient.refresh(client_id, refresh_token);
        if (status === 401) throw new UnauthorizedError();
        return data;
    }
}
