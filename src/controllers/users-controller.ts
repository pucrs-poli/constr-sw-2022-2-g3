import express from 'express';
import { Body, Controller, Delete, Get, Patch, Path, Post, Put, Request, Route, Security } from "tsoa";
import { KeycloakClient, KeycloakUserRepresentation } from "../clients/keycloak-client";

export type CreateUserRequest = KeycloakUserRepresentation;
export type UpdateUserRequest = KeycloakUserRepresentation;
export interface UpdateUserPasswordRequest {
    password: string;
}

@Route('/users')
export class UsersController extends Controller {

    /**
     * @example user {
     *   "username": "test-user"
     * }
     */
    @Security('api_key')
    @Post('/')
    async createUser(@Request() req: express.Request, @Body() user: CreateUserRequest) {
        const { data, status } = await KeycloakClient.createUser(req.user.token, user);
        this.setStatus(status);
        return data;
    }

    @Security('api_key')
    @Get('/')
    async getUsers(@Request() req: express.Request) {
        const { data, status } = await KeycloakClient.getUsers(req.user.token);
        this.setStatus(status);
        return data;
    }

    @Security('api_key')
    @Get('/{id}')
    async getUserById(@Request() req: express.Request, @Path() id: string) {
        const { data, status } = await KeycloakClient.getUserById(req.user.token, id);
        this.setStatus(status);
        return data;
    }

    /**
     * @example user {
     *   "firstName": "test-name"
     * }
     */
    @Security('api_key')
    @Put('/{id}')
    async updateUserById(@Request() req: express.Request, @Path() id: string, @Body() user: UpdateUserRequest) {
        const { data, status } = await KeycloakClient.updateUserById(req.user.token, id, user);
        this.setStatus(status);
        return data;
    }

    @Security('api_key')
    @Delete('/{id}')
    async deleteUserById(@Request() req: express.Request, @Path() id: string) {
        const { data, status } = await KeycloakClient.deleteUserById(req.user.token, id);
        this.setStatus(status);
        return data;
    }

    /**
     * @example payload {
     *   "password": "test-pass"
     * }
     */
    @Security('api_key')
    @Patch('/{id}')
    async updatePasswordById(@Request() req: express.Request, @Path() id: string, @Body() payload: UpdateUserPasswordRequest) {
        const { data, status } = await KeycloakClient.setUserPassword(req.user.token, id, payload.password);
        this.setStatus(status);
        return data;
    }
}
