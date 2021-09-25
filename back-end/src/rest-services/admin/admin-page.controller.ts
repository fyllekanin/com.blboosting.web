import { Controller, Get, Middleware } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../../utilities/internal.request';
import { StatusCodes } from 'http-status-codes';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';

@Controller('api/admin')
export class PageController {

    @Get('dashboard')
    @Middleware([AUTHORIZATION_MIDDLEWARE])
    async getDashboard(req: InternalRequest, res: Response): Promise<void> {
        res.status(StatusCodes.OK).json({ message: 'Tjabba tjena hallå' });
    }
}
