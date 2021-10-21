import { Controller, Get, Middleware } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../../utilities/internal.request';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { RolePermission } from '../../persistance/entities/role.entity';
import { StatusCodes } from 'http-status-codes';
import { RealmRepository } from '../../persistance/repositories/battle-net/realm.repository';
import { BoostSource } from '../../constants/boost-source.constant';
import { Class } from '../../constants/classes.constant';
import { Dungeon } from '../../constants/dungeons.constant';
import { Armor } from '../../constants/armors.constant';
import { Role } from '../../constants/roles.constant';
import { Faction } from '../../constants/factions.constant';

@Controller('api/admin/boosts')
export class BoostsController {

    @Get('context')
    @Middleware([AUTHORIZATION_MIDDLEWARE, PermissionMiddleware.getPermissionMiddleware([RolePermission.CAN_LOGIN, RolePermission.CAN_CREATE_BOOST])])
    async getContext(req: InternalRequest, res: Response): Promise<void> {
        res.status(StatusCodes.OK).json({
            realms: await RealmRepository.newRepository().getAll(),
            sources: Object.keys(BoostSource).map(key => BoostSource[key]),
            classes: Object.keys(Class).map(key => Class[key]),
            dungeons: Object.keys(Dungeon).map(key => Dungeon[key]),
            armors: Object.keys(Armor).map(key => Armor[key]),
            roles: Object.keys(Role).map(key => Role[key]),
            factions: Object.keys(Faction).map(key => Faction[key])
        });
    }
}
