import express from 'express';
import { Controller, Get, Request, Route, SuccessResponse } from "tsoa";

@Route('/reservations')
export class ReservationsController extends Controller {

    @Get('/')
    @SuccessResponse('200')
    async test(@Request() req: express.Request) {
        return 'Hello, bla bla bla, reservationsnnsnsn';
    }
}
