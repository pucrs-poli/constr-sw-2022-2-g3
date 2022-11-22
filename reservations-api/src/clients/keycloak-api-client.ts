import request from "request";

export interface KeycloakApiResponse<T> {
    status: number;
    data: T,
}

export interface PartialKeycloakUserRepresentation {
    groups?: string[];
}

export type KeycloakApiGetUserInfoResponse = KeycloakApiResponse<PartialKeycloakUserRepresentation>;

export class KeycloakApiClient {
    public static async getUserInfo(token: string): Promise<KeycloakApiGetUserInfoResponse> {
        const url = process.env.KEYCLOAK_API_SERVER_URL;
        return new Promise(resolve => {
            request({
                url: `${url}/user-info`,
                method: 'GET',
                headers: {
                    Authorization: token,
                },
                json: true,
            }, (_, response, body) => resolve({status: response?.statusCode || 500, data: body}));
        });
    }
}
