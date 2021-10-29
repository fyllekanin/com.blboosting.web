import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest, InternalUser } from '../../utilities/internal.request';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { RolePermission } from '../../persistance/entities/role.entity';
import { StatusCodes } from 'http-status-codes';
import { RealmRepository } from '../../persistance/repositories/battle-net/realm.repository';
import { BoostSource } from '../../constants/boost-source.constant';
import { Dungeon } from '../../constants/dungeons.constant';
import { Role } from '../../constants/roles.constant';
import { Faction } from '../../constants/factions.constant';
import { Client, GuildMember, TextChannel } from 'discord.js';
import { Configuration } from '../../configuration';
import { IBoostView, IKeyBoosterView } from '../../rest-service-views/admin/boosts.interface';
import { KeyBoostValidator } from '../../validatiors/admin/key-boost.validator';

@Controller('api/admin/boosts')
export class BoostsController {
    private static readonly BOOSTERS_CACHE_KEY = 'KEY_BOOSTERS';

    @Get('context')
    @Middleware([AUTHORIZATION_MIDDLEWARE, PermissionMiddleware.getPermissionMiddleware([RolePermission.CAN_LOGIN, RolePermission.CAN_CREATE_BOOST])])
    async getContext(req: InternalRequest, res: Response): Promise<void> {
        let boosters = Configuration.getCache().has(BoostsController.BOOSTERS_CACHE_KEY) ? Configuration.getCache().get(BoostsController.BOOSTERS_CACHE_KEY) : null;
        if (!boosters) {
            boosters = await this.getKeyBoosters(req.client);
            Configuration.getCache().set(BoostsController.BOOSTERS_CACHE_KEY, boosters, 300);
        }
        res.status(StatusCodes.OK).json({
            realms: await RealmRepository.newRepository().getAll(),
            sources: Object.keys(BoostSource).map(key => BoostSource[key]),
            dungeons: Object.keys(Dungeon).map(key => Dungeon[key]),
            roles: Object.keys(Role).map(key => Role[key]),
            factions: Object.keys(Faction).map(key => Faction[key]),
            boosters: boosters
        });
    }

    @Post()
    @Middleware([AUTHORIZATION_MIDDLEWARE, PermissionMiddleware.getPermissionMiddleware([RolePermission.CAN_LOGIN, RolePermission.CAN_CREATE_BOOST])])
    async createBoost(req: InternalRequest<IBoostView>, res: Response): Promise<void> {
        const errors = await (new KeyBoostValidator()).run(req, req.body);
        if (errors.length > 0) {
            res.status(StatusCodes.BAD_REQUEST).json(errors);
            return;
        }

        await (req.client.channels.cache.get(process.env.DISCORD_CREATE_BOOST) as TextChannel).send(`!boost ${await this.getConvertedPayload(req.user, req.body)}`);

        res.status(StatusCodes.OK).json();
    }

    private getConvertedPayload(user: InternalUser, entity: IBoostView): string {

        return JSON.stringify({
            name: entity.boost.name,
            realm: entity.boost.realm.value.name,
            source: entity.boost.source.value,
            payments: entity.payments.map(payment => !payment.realm ? null : ({
                amount: payment.amount,
                realm: payment.realm.value.name,
                faction: payment.faction.value
            })).filter(item => item),
            paidBalance: entity.balancePayment && entity.balancePayment > 0 ? entity.balancePayment : null,
            discount: entity.boost.discount && entity.boost.discount > 0 ? entity.boost.discount : null,
            stack: this.getStacks(entity),
            advertiser: {
                advertiserId: user.discordId,
                playing: entity.playAlong.isPlaying,
                role: entity.playAlong.role ? entity.playAlong.role.value : null
            },
            notes: entity.boost.note || '',
            keys: entity.keys.map(key => ({
                dungeon: key.dungeon.value.value,
                level: key.level.value,
                timed: key.isTimed,
                booster: key.keyHolder && key.keyHolder.user ? {
                    boosterId: key.keyHolder.user.value.discordId,
                    role: key.keyHolder.role.value
                } : null
            }))
        });
    }

    private getStacks(entity: IBoostView): Array<string> {
        const stacks = [];
        if (entity.boost.armor.cloth) stacks.push('Cloth');
        if (entity.boost.armor.leather) stacks.push('Leather');
        if (entity.boost.armor.mail) stacks.push('Mail');
        if (entity.boost.armor.plate) stacks.push('Plate');

        if (entity.boost.class.mage) stacks.push('Mage');
        if (entity.boost.class.warlock) stacks.push('Warlock');
        if (entity.boost.class.priest) stacks.push('Priest');
        if (entity.boost.class.druid) stacks.push('Druid');
        if (entity.boost.class.monk) stacks.push('Monk');
        if (entity.boost.class.demonHunter) stacks.push('Demon Hunter');
        if (entity.boost.class.rogue) stacks.push('Rogue');
        if (entity.boost.class.hunter) stacks.push('Hunter');
        if (entity.boost.class.shaman) stacks.push('Shaman');
        if (entity.boost.class.warrior) stacks.push('Warrior');
        if (entity.boost.class.paladin) stacks.push('Paladin');
        if (entity.boost.class.deathKnight) stacks.push('Death Knight');

        return stacks.length > 0 ? stacks : ['Any'];
    }

    private async getKeyBoosters(client: Client): Promise<{ low: Array<IKeyBoosterView>, medium: Array<IKeyBoosterView>, high: Array<IKeyBoosterView>, elite: Array<IKeyBoosterView> }> {
        const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
        const response: { low: Array<IKeyBoosterView>, medium: Array<IKeyBoosterView>, high: Array<IKeyBoosterView>, elite: Array<IKeyBoosterView> } = {
            low: [],
            medium: [],
            high: [],
            elite: []
        };
        (await guild.roles.fetch(Configuration.get().BoosterRoles.LOW_KEY_BOOSTER)).members.forEach(item => {
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
