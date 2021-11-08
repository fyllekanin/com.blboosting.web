import { Controller, Get, Middleware } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../../common/utilities/internal.request';
import { StatusCodes } from 'http-status-codes';
import { PermissionMiddleware } from './middlewares/permission.middleware';
import { RolePermission } from '../../common/persistance/entities/role.entity';
import * as winston from 'winston';

@Controller('api/page')
export class PageController {
    private LOGGER = winston.createLogger({
        transports: [
            new winston.transports.File({ filename: 'page-controller.log' })
        ]
    });

    @Get('test')
    @Middleware([PermissionMiddleware.getPermissionMiddleware([RolePermission.CAN_LOGIN])])
    async getTest(req: InternalRequest, res: Response): Promise<void> {
        try {
            res.status(StatusCodes.OK).json({ message: 'Tjabba tjena hallå' });
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).send(err);
        }
    }
}
