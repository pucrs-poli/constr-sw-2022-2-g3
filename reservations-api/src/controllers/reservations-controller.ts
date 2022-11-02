import { Body, Controller, Get, Path, Post, Route, SuccessResponse } from "tsoa";
import { CreateReservationDto } from "../dtos/reservations";
import { NotFoundError } from "../errors/non-found-error";
import { ReservationsService } from '../services/reservations-service';

@Route('/reservations')
export class ReservationsController extends Controller {

    // TODO: auth?
    @Get('/')
    @SuccessResponse('200')
    async findAll() {
        return await ReservationsService.findAll();
    }

    // TODO: auth?
    @Get('/:id')
    @SuccessResponse('200')
    async findById(@Path('id') id: number) {
        const reservation = await ReservationsService.findById(id);
        if (!reservation) throw new NotFoundError();
        return reservation;
    }

    // TODO: auth?
    @Post('/')
    @SuccessResponse('200')
    async create(@Body() body: CreateReservationDto) {
        return await ReservationsService.create(body);
    }
}
