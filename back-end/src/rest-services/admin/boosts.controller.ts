import { Controller, Get, Middleware } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../../utilities/internal.request';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { RolePermission } from '../../persistance/entities/role.entity';
import { StatusCodes } from 'http-status-codes';
import { BattleNetRegions, BattleNetService } from '../../apis/services/battle-net.service';

@Controller('api/admin/boosts')
export class BoostsController {

    @Get('context')
    @Middleware([AUTHORIZATION_MIDDLEWARE, PermissionMiddleware.getPermissionMiddleware([RolePermission.CAN_LOGIN, RolePermission.CAN_CREATE_BOOST])])
    async getContext(req: InternalRequest, res: Response): Promise<void> {
        res.status(StatusCodes.OK).json({
            realms: (await BattleNetService.getRealmList(BattleNetRegions.EU)).realms
        });
    }
}
