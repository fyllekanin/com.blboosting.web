import { Controller, Get, Middleware } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../../common/utilities/internal.request';
import { StatusCodes } from 'http-status-codes';
import { PermissionMiddleware } from './middlewares/permission.middleware';
import { RolePermission } from '../../common/persistance/entities/role.entity';

@Controller('api/page')
export class PageController {

    @Get('test')
    @Middleware([PermissionMiddleware.getPermissionMiddleware([RolePermission.CAN_LOGIN])])
    async getTest(req: InternalRequest, res: Response): Promise<void> {
        try {
            res.status(StatusCodes.OK).json({ message: 'Tjabba tjena hallå' });
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.BAD_REQUEST).json();
        }
    }
}
