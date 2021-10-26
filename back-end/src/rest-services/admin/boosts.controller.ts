import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../../utilities/internal.request';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { RolePermission } from '../../persistance/entities/role.entity';
import { StatusCodes } from 'http-status-codes';
import { RealmRepository } from '../../persistance/repositories/battle-net/realm.repository';
import { BoostSource } from '../../constants/boost-source.constant';
import { Dungeon } from '../../constants/dungeons.constant';
import { Role } from '../../constants/roles.constant';
import { Faction } from '../../constants/factions.constant';
import { Client, GuildMember } from 'discord.js';
import { Configuration } from '../../configuration';
import { IKeyBoosterView } from '../../rest-service-views/admin/boosts.interface';

@Controller('api/admin/boosts')
export class BoostsController {

    @Get('context')
    @Middleware([AUTHORIZATION_MIDDLEWARE, PermissionMiddleware.getPermissionMiddleware([RolePermission.CAN_LOGIN, RolePermission.CAN_CREATE_BOOST])])
    async getContext(req: InternalRequest, res: Response): Promise<void> {
        res.status(StatusCodes.OK).json({
            realms: await RealmRepository.newRepository().getAll(),
            sources: Object.keys(BoostSource).map(key => BoostSource[key]),
            dungeons: Object.keys(Dungeon).map(key => Dungeon[key]),
            roles: Object.keys(Role).map(key => Role[key]),
            factions: Object.keys(Faction).map(key => Faction[key]),
            boosters: await this.getKeyBoosters(req.client)
        });
    }

    @Post()
    @Middleware([AUTHORIZATION_MIDDLEWARE, PermissionMiddleware.getPermissionMiddleware([RolePermission.CAN_LOGIN, RolePermission.CAN_CREATE_BOOST])])
    async createBoost(req: InternalRequest, res: Response): Promise<void> {
        // empty
    }

    private async getKeyBoosters(client: Client): Promise<{ low: Array<IKeyBoosterView>, medium: Array<IKeyBoosterView>, high: Array<IKeyBoosterView>, elite: Array<IKeyBoosterView> }> {
        const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
        const response: { low: Array<IKeyBoosterView>, medium: Array<IKeyBoosterView>, high: Array<IKeyBoosterView>, elite: Array<IKeyBoosterView> } = {
            low: [],
            medium: [],
            high: [],
            elite: []
        };
        guild.roles.cache.get(Configuration.get().BoosterRoles.LOW_KEY_BOOSTER).members.forEach(item => {
            const data: IKeyBoosterView = {
                discordId: item.id,
                name: item.nickname ? item.nickname : item.displayName,
                armors: this.getUserArmors(item),
                classes: this.getUserClasses(item)
            };
            response.low.push(data);

            if (item.roles.cache.get(Configuration.get().BoosterRoles.MEDIUM_KEY_BOOSTER)) {
                response.medium.push(data);
            }
            if (item.roles.cache.get(Configuration.get().BoosterRoles.HIGH_KEY_BOOSTER)) {
                response.high.push(data);
            }
            if (item.roles.cache.get(Configuration.get().BoosterRoles.ELITE_KEY_BOOSTER)) {
                response.elite.push(data);
            }
        });

        return response;
    }

    private getUserClasses(user: GuildMember): {
        priest: boolean,
        warlock: boolean,
        mage: boolean,
        druid: boolean,
        monk: boolean,
        rogue: boolean,
        demonHunter: boolean,
        hunter: boolean,
        shaman: boolean,
        warrior: boolean,
        deathKnight: boolean,
        paladin: boolean
    } {
        return {
            priest: user.roles.cache.get(Configuration.get().ClassRoles.PRIEST.discordId) != null,
            warlock: user.roles.cache.get(Configuration.get().ClassRoles.WARLOCK.discordId) != null,
            mage: user.roles.cache.get(Configuration.get().ClassRoles.MAGE.discordId) != null,
            druid: user.roles.cache.get(Configuration.get().ClassRoles.DRUID.discordId) != null,
            monk: user.roles.cache.get(Configuration.get().ClassRoles.MONK.discordId) != null,
            rogue: user.roles.cache.get(Configuration.get().ClassRoles.ROGUE.discordId) != null,
            demonHunter: user.roles.cache.get(Configuration.get().ClassRoles.DEMON_HUNTER.discordId) != null,
            hunter: user.roles.cache.get(Configuration.get().ClassRoles.HUNTER.discordId) != null,
            shaman: user.roles.cache.get(Configuration.get().ClassRoles.SHAMAN.discordId) != null,
            warrior: user.roles.cache.get(Configuration.get().ClassRoles.WARRIOR.discordId) != null,
            deathKnight: user.roles.cache.get(Configuration.get().ClassRoles.DEATH_KNIGHT.discordId) != null,
            paladin: user.roles.cache.get(Configuration.get().ClassRoles.PALADIN.discordId) != null
        }
    }

    private getUserArmors(user: GuildMember): {
        cloth: boolean,
        leather: boolean,
        mail: boolean,
        plate: boolean
    } {
        return {
            cloth: user.roles.cache.get(Configuration.get().ArmorRoles.CLOTH.discordId) != null,
            leather: user.roles.cache.get(Configuration.get().ArmorRoles.LEATHER.discordId) != null,
            mail: user.roles.cache.get(Configuration.get().ArmorRoles.MAIL.discordId) != null,
            plate: user.roles.cache.get(Configuration.get().ArmorRoles.PLATE.discordId) != null
        }
    }
}
