import { ClassMiddleware, Controller, Get, Middleware } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../../utilities/internal.request';
import { StatusCodes } from 'http-status-codes';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { RolePermission } from '../../persistance/entities/role.entity';
import { BATTLE_NET_MIDDLEWARE } from '../middlewares/battle-net.middleware';
import { CharacterRepository } from '../../persistance/repositories/battle-net/character.repository';
import { Faction } from '../../constants/factions.constant';

@Controller('api/admin')
@ClassMiddleware([AUTHORIZATION_MIDDLEWARE, BATTLE_NET_MIDDLEWARE])
export class AdminPageController {

    @Get('dashboard')
    @Middleware([PermissionMiddleware.getPermissionMiddleware([RolePermission.CAN_LOGIN])])
    async getDashboard(req: InternalRequest, res: Response): Promise<void> {
        const characters = await CharacterRepository.newRepository().getCharacterForUserId(req.user.id);

        res.status(StatusCodes.OK).json({
            characters: characters.map(character => ({
                name: character.name,
                class: character.class,
                faction: Faction[character.faction].label,
                inset: character.characterAssets.inset
            }))
        });
    }
}
