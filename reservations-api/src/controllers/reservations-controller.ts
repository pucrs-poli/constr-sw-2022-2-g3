import { Body, Controller, Delete, Get, Patch, Path, Post, Put, Query, Request, Route, Security, SuccessResponse } from "tsoa";
import { CreateReservationDto, UpdateReservationDto } from "../dtos/reservations";
import { NotFoundError } from "../errors/non-found-error";
import { ReservationWhereQuery } from "../repositories/reservations-repository";
import { ReservationsService } from '../services/reservations-service';
import { buildFieldWhereQuery } from "../utils/query-builders";
import express from "express";

@Route('/reservations')
export class ReservationsController extends Controller {

    private generateWhereQuery(id?: string, observation?: string, classId?: string, resourceId?: string, active?: string): ReservationWhereQuery {
        return {
            ...(id !== undefined ? { id: buildFieldWhereQuery('string', id) } : {}),
            ...(observation !== undefined ? { observation: buildFieldWhereQuery('string', observation) } : {}),
            ...(classId !== undefined ? { class_id: buildFieldWhereQuery('string', classId) } : {}),
            ...(resourceId !== undefined ? { resource_id: buildFieldWhereQuery('string', resourceId) } : {}),
            ...(active !== undefined ? { active: buildFieldWhereQuery('boolean', active) } : {}),
        }
    }
    
    @Get('/')
    @SuccessResponse('200')
    @Security('api_key', ['coordenadores', 'professores'])
    async findAll(
        @Request() req: express.Request,
        @Query('id') id?: string,
        @Query('observation') observation?: string,
        @Query('class_id') class_id?: string,
        @Query('resource_id') resource_id?: string,
        @Query('active') active?: string,
    ) {
        const query = this.generateWhereQuery(id, observation, class_id, resource_id, active);
        return await ReservationsService.findAll(req.user.token, query);
    }

    @Get('/:id')
    @SuccessResponse('200')
    @Security('api_key', ['coordenadores', 'professores'])
    async findById(
        @Request() req: express.Request,
        @Path('id') id: string
    ) {
        const reservation = await ReservationsService.findById(req.user.token, id);
        if (!reservation) throw new NotFoundError();
        return reservation;
    }

    @Post('/')
    @SuccessResponse('201')
    @Security('api_key', ['coordenadores', 'professores'])
    async create(
        @Request() req: express.Request,
        @Body() body: CreateReservationDto
    ) {
        return await ReservationsService.create(req.user.token, body);
    }

    @Patch('/')
    @SuccessResponse('200')
    @Security('api_key', ['coordenadores', 'professores'])
    async update(
        @Request() req: express.Request,
        @Body() body: UpdateReservationDto
    ) {
        return await ReservationsService.update(req.user.token, body);
    }

    @Put('/')
    @SuccessResponse('200')
    @Security('api_key', ['coordenadores', 'professores'])
    async updateAll(
        @Request() req: express.Request,
        @Body() body: UpdateReservationDto
    ) {
        return await ReservationsService.update(req.user.token, body);
    }

    @Delete('/:id')
    @SuccessResponse('204')
    @Security('api_key', ['coordenadores', 'professores'])
    async deleteById(@Path('id') id: string) {
        return await ReservationsService.deleteById(id);
    }
}
