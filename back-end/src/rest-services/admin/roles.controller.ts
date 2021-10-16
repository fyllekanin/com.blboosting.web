import { ClassMiddleware, Controller, Get, Put } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../../utilities/internal.request';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { RolePermission } from '../../persistance/entities/role.entity';
import { RoleRepository } from '../../persistance/repositories/role.repository';
import { StatusCodes } from 'http-status-codes';
import { DiscordUtility } from '../../utilities/discord.utility';
import { ObjectId } from 'mongodb';

@Controller('api/admin/roles')
@ClassMiddleware([AUTHORIZATION_MIDDLEWARE, PermissionMiddleware.getPermissionMiddleware([RolePermission.CAN_LOGIN, RolePermission.CAN_MANAGE_ROLES])])
export class RolesController {

    @Get('page/:page')
    async getList(req: InternalRequest, res: Response): Promise<void> {
        const position = await RoleRepository.newRepository()
            .getImmunity(req.user.discordId, DiscordUtility.getRoleIds(req.client, req.user.discordId));

        res.status(StatusCodes.OK).json(await RoleRepository.newRepository().paginate({
            page: Number(req.params.page),
            take: 20,
            orderBy: {
                sort: 'name',
                order: 'ASC'
            },
            filter: {
                position: { $lt: position }
            }
        }));
    }

    @Get('role/:id')
    async getRole(req: InternalRequest, res: Response): Promise<void> {
        const position = await RoleRepository.newRepository()
            .getImmunity(req.user.discordId, DiscordUtility.getRoleIds(req.client, req.user.discordId));

        const role = await RoleRepository.newRepository().get(new ObjectId(req.params.id));
        if (!role || role.position >= position) {
            res.status(StatusCodes.NOT_FOUND).json();
            return;
        }

        res.status(StatusCodes.OK).json(role);
    }

    @Put('role/:id')
    async updateRole(req: InternalRequest, res: Response): Promise<void> {
        const position = await RoleRepository.newRepository()
            .getImmunity(req.user.discordId, DiscordUtility.getRoleIds(req.client, req.user.discordId));
        const role = await RoleRepository.newRepository().get(new ObjectId(req.params.id));
        if (!role || role.position >= position) {
            res.status(StatusCodes.NOT_FOUND).json();
            return;
        }

        await RoleRepository.newRepository().update(req.body);

        res.status(StatusCodes.OK).json(role);
    }
}
