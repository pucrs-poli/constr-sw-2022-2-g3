import { KeycloakClient, KeycloakUserRepresentation } from "../clients/keycloak-client";
import { EMAIL_REGEX } from '../constants';
import { ConflictError } from "../errors/conflict-error";
import { ForbiddenError } from "../errors/forbidden-error";
import { InvalidEmailError } from '../errors/invalid-email-error';
import { NotFoundError } from "../errors/non-found-error";
import { UnauthorizedError } from "../errors/unauthorized-error";

export type CreateUserRequest = KeycloakUserRepresentation;
export type UpdateUserRequest = KeycloakUserRepresentation;
export interface UpdateUserPasswordRequest {
    password: string;
}

export class UsersService {

    static async createUser(token: string, user: CreateUserRequest) {
        if (!user.email?.match(EMAIL_REGEX)) throw new InvalidEmailError(user.email);
        const { data, status } = await KeycloakClient.createUser(token, user);
        if (status === 401) throw new UnauthorizedError();
        if (status === 403) throw new ForbiddenError();
        if (status === 409) throw new ConflictError();
        return data;
    }

    static async getUsers(token: string) {
        const { data, status } = await KeycloakClient.getUsers(token);
        if (status === 401) throw new UnauthorizedError();
        if (status === 403) throw new ForbiddenError();
        return data;
    }

    static async getUserById(token: string, id: string) {
        const { data, status } = await KeycloakClient.getUserById(token, id);
        if (status === 401) throw new UnauthorizedError();
        if (status === 403) throw new ForbiddenError();
        if (status === 404) throw new NotFoundError();
        return data;
    }

    static async updateUserById(token: string, id: string, user: UpdateUserRequest) {
        const { data, status } = await KeycloakClient.updateUserById(token, id, user);
        if (status === 401) throw new UnauthorizedError();
        if (status === 403) throw new ForbiddenError();
        if (status === 404) throw new NotFoundError();
        return data;
    }

    static async deleteUserById(token: string, id: string) {
        const { data, status } = await KeycloakClient.deleteUserById(token, id);
        if (status === 401) throw new UnauthorizedError();
        if (status === 403) throw new ForbiddenError();
        if (status === 404) throw new NotFoundError();
        return data;
    }

    static async updatePasswordById(token: string, id: string, payload: UpdateUserPasswordRequest) {
        const { data, status } = await KeycloakClient.setUserPassword(token, id, payload.password);
        if (status === 401) throw new UnauthorizedError();
        if (status === 403) throw new ForbiddenError();
        if (status === 404) throw new NotFoundError();
        return data;
    }
}
