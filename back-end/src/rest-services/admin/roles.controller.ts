import { Controller, Get, Middleware } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../../utilities/internal.request';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { RolePermission } from '../../persistance/entities/role.entity';
import { RoleRepository } from '../../persistance/repositories/role.repository';
import { StatusCodes } from 'http-status-codes';
import { DiscordUtility } from '../../utilities/discord.utility';

@Controller('api/admin/roles')
export class RolesController {

    @Get('page/:page')
    @Middleware([AUTHORIZATION_MIDDLEWARE, PermissionMiddleware.getPermissionMiddleware([RolePermission.CAN_LOGIN, RolePermission.CAN_MANAGE_ROLES])])
    async getDashboard(req: InternalRequest, res: Response): Promise<void> {
        const position = RoleRepository.newRepository().getImmunity(req.user.discordId, DiscordUtility.getRoleIds(req.client, req.user.discordId));

        res.status(StatusCodes.OK).json(RoleRepository.newRepository().paginate({
            page: Number(req.params.page),
            take: 20,
            orderBy: {
                sort: 'name',
                order: 'ASC'
            },
            where: {
                position: {
                    $lt: position
                }
            }
        }));
    }
}
