import { Controller, Get, Middleware, Put } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../../../common/utilities/internal.request';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { IRoleEntity, IRolePermissions, RolePermission } from '../../../common/persistance/entities/role.entity';
import { RoleRepository } from '../../../common/persistance/repositories/role.repository';
import { StatusCodes } from 'http-status-codes';
import { DiscordUtility } from '../../../common/utilities/discord.utility';
import { ObjectId } from 'mongodb';
import { BATTLE_NET_MIDDLEWARE } from '../middlewares/battle-net.middleware';

@Controller('api/admin/roles')
export class RolesController {

    @Get('page/:page')
    @Middleware([AUTHORIZATION_MIDDLEWARE, BATTLE_NET_MIDDLEWARE, PermissionMiddleware.getPermissionMiddleware([RolePermission.CAN_LOGIN, RolePermission.CAN_MANAGE_ROLES])])
    async getList(req: InternalRequest, res: Response): Promise<void> {
        try {
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
                    position: { $lt: position },
                    name: req.query.name ? { $regex: new RegExp(`${req.query.name}`, 'i') } : undefined
                }
            }));
        } catch (err) {
            console.error(err);
            res.status(StatusCodes.BAD_REQUEST).json();
        }
    }

    @Get('role/:id')
    @Middleware([AUTHORIZATION_MIDDLEWARE, BATTLE_NET_MIDDLEWARE, PermissionMiddleware.getPermissionMiddleware([RolePermission.CAN_LOGIN, RolePermission.CAN_MANAGE_ROLES])])
    async getRole(req: InternalRequest, res: Response): Promise<void> {
        try {
            const position = await RoleRepository.newRepository()
                .getImmunity(req.user.discordId, DiscordUtility.getRoleIds(req.client, req.user.discordId));

            const role = await RoleRepository.newRepository().get(new ObjectId(req.params.id));
            if (!role || role.position >= position) {
                res.status(StatusCodes.NOT_FOUND).json();
                return;
            }

            res.status(StatusCodes.OK).json(role);
        } catch (err) {
            console.error(err);
            res.status(StatusCodes.BAD_REQUEST).json();
        }
    }

    @Put('role/:id')
    @Middleware([AUTHORIZATION_MIDDLEWARE, BATTLE_NET_MIDDLEWARE, PermissionMiddleware.getPermissionMiddleware([RolePermission.CAN_LOGIN, RolePermission.CAN_MANAGE_ROLES])])
    async updateRole(req: InternalRequest<IRoleEntity>, res: Response): Promise<void> {
        try {
            const position = await RoleRepository.newRepository()
                .getImmunity(req.user.discordId, DiscordUtility.getRoleIds(req.client, req.user.discordId));
            const permissions = await RoleRepository.newRepository()
                .getPermissions(req.user.discordId, DiscordUtility.getRoleIds(req.client, req.user.discordId));

            const role = await RoleRepository.newRepository().get(new ObjectId(req.params.id));
            if (!role || role.position >= position) {
                res.status(StatusCodes.NOT_FOUND).json();
                return;
            }
            req.body.permissions = this.getNewPermissions(role, req.body, permissions);

            await RoleRepository.newRepository().update(req.body);

            res.status(StatusCodes.OK).json(role);
        } catch (err) {
            console.error(err);
            res.status(StatusCodes.BAD_REQUEST).json();
        }
    }

    private getNewPermissions(originalRole: IRoleEntity, updatedRole: IRoleEntity, permissions: IRolePermissions): IRolePermissions {
        const newPermissions: IRolePermissions = {};
        for (const key in RolePermission) {
            // @ts-ignore
            if (!permissions[key]) {
                // @ts-ignore
                newPermissions[key] = originalRole.permissions[key];
            } else {
                // @ts-ignore
                newPermissions[key] = updatedRole.permissions[key];
            }
        }
        return newPermissions;
    }
}
