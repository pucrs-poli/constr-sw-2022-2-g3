import { KeycloakApiClient } from "../clients/keycloak-api-client";

export class AuthService {
    static async getUserInfo(token: string) {
        return await KeycloakApiClient.getUserInfo(token);
    }
}
