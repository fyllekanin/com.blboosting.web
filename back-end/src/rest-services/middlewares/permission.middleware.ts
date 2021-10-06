import { NextFunction, Response } from 'express';
import { InternalRequest } from '../../utilities/internal.request';
import { StatusCodes } from 'http-status-codes';
import { RolePermission } from '../../persistance/entities/role.entity';
import { RoleRepository } from '../../persistance/repositories/role.repository';
import { DiscordUtility } from '../../utilities/discord.utility';

export class PermissionMiddleware {

    static getPermissionMiddleware(permissions: Array<RolePermission>): (req: InternalRequest, res: Response, next: NextFunction) => void {
        return async (req: InternalRequest, res: Response, next: NextFunction) => {
            if (!req.client) {
                throw new Error('Client is not set to the permission middleware');
            }

            const roleIds = DiscordUtility.getRoleIds(req.client, req.user.discordId);
            if (!(await RoleRepository.newRepository().doUserHavePermission(req.user.discordId, permissions, roleIds))) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    isTokenExisting: Boolean(req.user.token),
                    isPermissionRelated: true
                });
                return;
            }
            next();
        };
    }
}
