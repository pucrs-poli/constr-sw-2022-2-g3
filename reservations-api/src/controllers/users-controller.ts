import express from 'express';
import { Body, Controller, Delete, Get, Patch, Path, Post, Put, Request, Response, Route, Security, SuccessResponse } from "tsoa";
import { CreateUserRequest, UpdateUserPasswordRequest, UpdateUserRequest, UsersService } from '../services/users-service';

@Route('/users')
export class UsersController extends Controller {

    /**
     * @example user {
     *   "username": "test-user"
     * }
     */
    @Security('api_key')
    @Post('/')
    @SuccessResponse('201')
    async createUser(@Request() req: express.Request, @Body() user: CreateUserRequest) {
        return UsersService.createUser(req.user.token, user);
    }

    @Security('api_key')
    @Get('/')
    @SuccessResponse('200')
    async getUsers(@Request() req: express.Request) {
        return UsersService.getUsers(req.user.token);
    }

    @Security('api_key')
    @Get('/{id}')
    @SuccessResponse('200')
    async getUserById(@Request() req: express.Request, @Path() id: string) {
        return UsersService.getUserById(req.user.token, id);
    }

    /**
     * @example user {
     *   "firstName": "test-name"
     * }
     */
    @Security('api_key')
    @Put('/{id}')
    @SuccessResponse('200')
    async updateUserById(@Request() req: express.Request, @Path() id: string, @Body() user: UpdateUserRequest) {
        return UsersService.updateUserById(req.user.token, id, user);
    }

    @Security('api_key')
    @Delete('/{id}')
    @SuccessResponse('200')
    async deleteUserById(@Request() req: express.Request, @Path() id: string) {
        return UsersService.deleteUserById(req.user.token, id);
    }

    /**
     * @example payload {
     *   "password": "test-pass"
     * }
     */
    @Security('api_key')
    @Patch('/{id}')
    @SuccessResponse('200')
    async updatePasswordById(@Request() req: express.Request, @Path() id: string, @Body() payload: UpdateUserPasswordRequest) {
        return UsersService.updatePasswordById(req.user.token, id, payload);
    }
}
