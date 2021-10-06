import { Controller, Get, Middleware } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../../utilities/internal.request';
import { StatusCodes } from 'http-status-codes';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { RolePermission } from '../../persistance/entities/role.entity';

@Controller('api/admin')
export class AdminPageController {

    @Get('dashboard')
    @Middleware([AUTHORIZATION_MIDDLEWARE, PermissionMiddleware.getPermissionMiddleware([RolePermission.CAN_LOGIN])])
    async getDashboard(req: InternalRequest, res: Response): Promise<void> {
        res.status(StatusCodes.OK).json({message: 'Tjabba tjena hallå'});
    }
}
