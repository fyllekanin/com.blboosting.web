import { ClassMiddleware, Controller, Get, Middleware } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../../../common/utilities/internal.request';
import { StatusCodes } from 'http-status-codes';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { RolePermission } from '../../../common/persistance/entities/role.entity';
import { BATTLE_NET_MIDDLEWARE } from '../middlewares/battle-net.middleware';
import { CharacterRepository } from '../../../common/persistance/repositories/battle-net/character.repository';
import { Faction } from '../../../common/constants/factions.constant';
import { ICharacter } from '../../../common/persistance/entities/battle-net/character.entity';

@Controller('api/admin')
@ClassMiddleware([AUTHORIZATION_MIDDLEWARE, BATTLE_NET_MIDDLEWARE])
export class AdminPageController {

    @Get('dashboard')
    @Middleware([PermissionMiddleware.getPermissionMiddleware([RolePermission.CAN_LOGIN])])
    async getDashboard(req: InternalRequest, res: Response): Promise<void> {
        try {
            const characters = await CharacterRepository.newRepository().getCharacterForUserId(req.user.id);

            res.status(StatusCodes.OK).json({
                characters: characters.map(character => ({
                    name: character.name,
                    class: character.class,
                    faction: Faction[character.faction].label,
                    inset: character.characterAssets.inset,
                    raiderId: character.raiderIo ? character.raiderIo : null,
                    mythicPlus: this.getMythicPlusFor(character),
                    raiding: character.raid ? {
                        bestAverage: character.raid ? character.raid.bestPerformanceAverage : 0
                    } : null
                }))
            });
        } catch (err) {
            console.error(err);
            res.status(StatusCodes.BAD_REQUEST).json();
        }
    }

    private getMythicPlusFor(character: ICharacter): { role: string, score: number } {
        if (!character.raiderIo) {
            return null;
        }
        const highest = Object.keys(character.raiderIo).reduce((prev, curr) => {
            // @ts-ignore
            return curr !== 'all' && character.raiderIo[curr] > character.raiderIo[prev] ? curr : prev;
        }, 'dps');

        // @ts-ignore
        const score = character.raiderIo[highest];
        return {
            role: highest,
            score: score
        };
    }
}
