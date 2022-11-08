import { Body, Controller, Get, Patch, Path, Post, Query, Route, SuccessResponse } from "tsoa";
import { CreateReservationDto, UpdateReservationDto } from "../dtos/reservations";
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
    async findById(@Path('id') id: string) {
        const reservation = await ReservationsService.findById(id);
        if (!reservation) throw new NotFoundError();
        return reservation;
    }

    // TODO: auth?
    @Get('/resource/:resourceId/status')
    @SuccessResponse('200')
    async getByResourceIdAndTime(@Path('resourceId') resourceId: string, @Query('time') time?: number) {
        return await ReservationsService.getResourceStatusByResourceIdAndTime(resourceId, time);
    }

    // TODO: auth?
    @Post('/')
    @SuccessResponse('200')
    async create(@Body() body: CreateReservationDto) {
        return await ReservationsService.create(body);
    }

    // TODO: auth?
    @Patch('/')
    @SuccessResponse('200')
    async update(@Body() body: UpdateReservationDto) {
        return await ReservationsService.update(body);
    }
}
