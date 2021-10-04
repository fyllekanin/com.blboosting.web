import { Controller, Get, Middleware } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../../utilities/internal.request';
import { StatusCodes } from 'http-status-codes';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';

@Controller('api/admin/roles')
export class RolesController {

    @Get('page/:page')
    @Middleware([AUTHORIZATION_MIDDLEWARE])
    async getDashboard(req: InternalRequest, res: Response): Promise<void> {
        res.status(StatusCodes.OK).json({message: 'Tjabba tjena hallå'});
    }
}
