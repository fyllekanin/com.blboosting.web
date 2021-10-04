import { NextFunction, Response } from 'express';
import { InternalRequest } from '../../utilities/internal.request';
import { StatusCodes } from 'http-status-codes';
import { Client } from 'discord.js';
import { RolePermission } from '../../persistance/entities/role.entity';
import { RoleRepository } from '../../persistance/repositories/role.repository';

export class PermissionMiddleware {
    static client: Client;

    static getPermissionMiddleware(permission: RolePermission): (req: InternalRequest, res: Response, next: NextFunction) => void {
        return async (req: InternalRequest, res: Response, next: NextFunction) => {
            if (!this.client) {
                throw new Error('Client is not set to the permission middleware');
            }

            const roleIds = this.getRoleIds(req.user.discordId);
            if (!(await RoleRepository.newRepository().doUserHavePermission(req.user.discordId, permission, roleIds))) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    isTokenExisting: Boolean(req.user.token),
                    isPermissionRelated: true
                });
                return;
            }
            next();
        };
    }

    private static getRoleIds(discordId: string): Array<string> {
        const guild = this.client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
        const member = guild.members.cache.get(discordId);
        const roleIds: Array<string> = [];
        member.roles.cache.forEach(role => roleIds.push(role.id));
        return roleIds;
    }
}

export const PERMISSION_MIDDLEWARE = async (req: InternalRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.id || !req.user.token) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            isTokenExisting: Boolean(req.user.token)
        });
        return;
    }
    next();
};
