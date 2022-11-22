import { KeycloakClient } from "../clients/keycloak-client";
import { UnauthorizedError } from "../errors/unauthorized-error";

export interface LoginRequest {
    username: string,
    password: string,
    client_id?: string;
    client_secret?: string;
    realm?: string;
}

export interface RefreshRequest {
    refresh_token: string   
}

export class AuthService {
    static async login(loginRequest: LoginRequest) {
        const { username, password, client_id, client_secret, realm } = loginRequest;
        const { data, status } = await KeycloakClient.login(username, password, realm, client_id, client_secret);
        if (status === 401) throw new UnauthorizedError();
        return data;
    }

    static async refresh(refreshRequest: RefreshRequest) {
        const { refresh_token} = refreshRequest;
        const { data, status } = await KeycloakClient.refresh(refresh_token);
        if (status === 401) throw new UnauthorizedError();
        return data;
    }

    static async getUserInfo(token: string) {
        const { data, status } = await KeycloakClient.getUserInfo(token);
        if (status === 401) throw new UnauthorizedError();
        return data;
    }
}
