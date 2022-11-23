import request from "request";

export interface KeycloakResponse<T> {
    status: number;
    data: T,
}

export type KeycloakLoginResponse = KeycloakResponse<KeycloakAuth>;

export type KeycloakRefreshResponse = KeycloakResponse<KeycloakAuth>;

export interface KeycloakAuth {
    token_type: string;
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_expires_in: number;
}


export interface KeycloakUserConsentRepresentation {
    clientId?: string;
    createdDate?: number;
    grantedClientScopes?: string[];
    lastUpdatedDate?: number;
}

export interface KeycloakCredentialRepresentation {
    createdDate?: number;
    credentialData?: string;
    id?: string;
    priority?: number;
    secretData?: string;
    temporary?: boolean;
    type?: string;
    userLabel?: string;
    value?: string;
}

export interface KeycloakFederatedIdentityRepresentation {
    identityProvider?: number;
    userId?: string;
    userName?: string;
}

export interface KeycloakUserRepresentation {
    access?: any;
    attributes?: any;
    clientConsents?: KeycloakUserConsentRepresentation[];
    clientRoles?: any;
    createdTimestamp?: number;
    credentials?: KeycloakCredentialRepresentation[];
    disableableCredentialTypes?: string[];
    email?: string
    emailVerified?: boolean;
    enabled?: boolean;
    federatedIdentities?: KeycloakFederatedIdentityRepresentation[];
    federationLink?: string;
    firstName?: string;
    groups?: string[];
    id?: string;
    lastName?: string;
    notBefore?: number;
    origin?: string;
    realmRoles?: string[];
    requiredActions?: string[];
    self?: string;
    serviceAccountClientId?: string;
    username?: string;
}

export type KeycloakCreateUserRequest = KeycloakUserRepresentation;
export type KeycloakCreateUserResponse = KeycloakResponse<{}>;

export type KeycloakUpdateUserRequest = KeycloakUserRepresentation;
export type KeycloakUpdateUserResponse = KeycloakResponse<{}>;

export type KeycloakGetUserInfoResponse = KeycloakResponse<KeycloakUserRepresentation>;

export class KeycloakClient {
    public static async login(
        username: string,
        password: string,
        _realm?: string,
        _client_id?: string,
        _client_secret?: string
    ): Promise<KeycloakLoginResponse> {
        const realm = _realm || process.env.KEYCLOAK_REALM;
        const client_id = _client_id || process.env.KEYCLOAK_RESOURCE;
        const client_secret = _client_secret || process.env.KEYCLOAK_SECRET;
        const url = process.env.KEYCLOAK_AUTH_SERVER_URL;
        return new Promise(resolve => {
            request({
                url: `${url}/realms/${realm}/protocol/openid-connect/token`,
                method: 'POST',
                form: {
                    client_id,
                    client_secret,
                    username,
                    password,
                    grant_type: 'password',
                },
                json: true,
            }, (_, response, body) => resolve({status: response?.statusCode || 500, data: body}));
        });
    }

    public static async refresh(refresh_token: string): Promise<KeycloakRefreshResponse> {
        const url = process.env.KEYCLOAK_AUTH_SERVER_URL;
        const realm = process.env.KEYCLOAK_REALM;
        const secret = process.env.KEYCLOAK_SECRET;
        const clientId = process.env.KEYCLOAK_RESOURCE;
        return new Promise(resolve => {
            request({
                url: `${url}/realms/${realm}/protocol/openid-connect/token`,
                method: 'POST',
                form: {
                    client_id: clientId,
                    client_secret: secret,
                    refresh_token,                                    
                    grant_type: 'refresh_token',
                },
                json: true,
            }, (_, response, body) => resolve({status: response?.statusCode || 500, data: body}));
        });
    }

    public static async getUserInfo(token: string): Promise<KeycloakGetUserInfoResponse> {
        const url = process.env.KEYCLOAK_AUTH_SERVER_URL;
        const realm = process.env.KEYCLOAK_REALM;
        return new Promise(resolve => {
            request({
                url: `${url}/realms/${realm}/protocol/openid-connect/userinfo`,
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                },
                json: true,
            }, (_, response, body) => resolve({status: response?.statusCode || 500, data: body}));
        });
    }

    public static async createUser(token: string, body: KeycloakCreateUserRequest): Promise<KeycloakCreateUserResponse> {
        const url = process.env.KEYCLOAK_AUTH_SERVER_URL;
        const realm = process.env.KEYCLOAK_REALM;
        return new Promise<{status: number, data: any}>(resolve => {
            request({
                url: `${url}/admin/realms/${realm}/users`,
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                },
                body,
                json: true,
            }, (_, response, body) => resolve({status: response?.statusCode || 500, data: body}));
        });
    }

    public static async getUsers(token: string) {
        const url = process.env.KEYCLOAK_AUTH_SERVER_URL;
        const realm = process.env.KEYCLOAK_REALM;
        return new Promise<{status: number, data: any[]}>(resolve => {
            request({
                url: `${url}/admin/realms/${realm}/users`,
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                },
                json: true,
            }, (_, response, body) => resolve({status: response?.statusCode || 500, data: body}));
        });
    }

    public static async getUserById(token: string, id: string) {
        const url = process.env.KEYCLOAK_AUTH_SERVER_URL;
        const realm = process.env.KEYCLOAK_REALM;
        return new Promise<{status: number, data: any}>(resolve => {
            request({
                url: `${url}/admin/realms/${realm}/users/${id}`,
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                },
                json: true,
            }, (_, response, body) => resolve({status: response?.statusCode || 500, data: body}));
        });
    }

    public static async deleteUserById(token: string, id: string) {
        const url = process.env.KEYCLOAK_AUTH_SERVER_URL;
        const realm = process.env.KEYCLOAK_REALM;
        return new Promise<{status: number, data: any}>(resolve => {
            request({
                url: `${url}/admin/realms/${realm}/users/${id}`,
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + token,
                },
                json: true,
            }, (_, response, body) => resolve({status: response?.statusCode || 500, data: body}));
        });
    }
    

    public static async updateUserById(token: string, id: string, body: KeycloakUpdateUserRequest): Promise<KeycloakUpdateUserResponse> {
        const url = process.env.KEYCLOAK_AUTH_SERVER_URL;
        const realm = process.env.KEYCLOAK_REALM;
        return new Promise<{status: number, data: any}>(resolve => {
            request({
                url: `${url}/admin/realms/${realm}/users/${id}`,
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + token,
                },
                body,
                json: true,
            }, (_, response, body) => resolve({status: response?.statusCode || 500, data: body}));
        });
    }

    public static async setUserPassword(token: string, id: string, password: string) {
        const url = process.env.KEYCLOAK_AUTH_SERVER_URL;
        const realm = process.env.KEYCLOAK_REALM;
        const a = {
            type: 'password',
            temporary: false,
            value: password,
        }
        return new Promise<{status: number, data: any}>(resolve => {
            request({
                url: `${url}/admin/realms/${realm}/users/${id}/reset-password`,
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + token,
                },
                body: a,
                json: true,
            }, (_, response, body) => resolve({status: response?.statusCode || 500, data: body}));
        });
    }
}
