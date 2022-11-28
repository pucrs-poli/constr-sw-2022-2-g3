import express from "express";
import { Body, Controller, Get, Post, Request, Route, Security, SuccessResponse } from "tsoa";
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

    @Get('/user-info')
    @Security('api_key')
    @SuccessResponse('200')
    async getUserInfo(@Request() req: express.Request) {
        return AuthService.getUserInfo(req.user.token);
    }
}
