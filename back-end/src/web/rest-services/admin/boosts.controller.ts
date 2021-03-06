import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest, InternalUser } from '../../../common/utilities/internal.request';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { RolePermission } from '../../../common/persistance/entities/role.entity';
import { StatusCodes } from 'http-status-codes';
import { RealmRepository } from '../../../common/persistance/repositories/battle-net/realm.repository';
import { BoostSource } from '../../../common/constants/boost-source.constant';
import { Dungeon } from '../../../common/constants/dungeons.constant';
import { Role } from '../../../common/constants/roles.constant';
import { Faction } from '../../../common/constants/factions.constant';
import { MessageReaction, TextChannel } from 'discord.js';
import { IBoostView } from '../../rest-service-views/admin/boosts.interface';
import { KeyBoostValidator } from '../../validators/admin/key-boost.validator';
import { ILabelValue } from '../../rest-service-views/common.interface';
import { RoleRepository } from '../../../common/persistance/repositories/role.repository';
import { BATTLE_NET_MIDDLEWARE } from '../middlewares/battle-net.middleware';
import { ValidationError } from '../../../common/constants/validation.error';
import { DiscordUtility } from '../../../common/utilities/discord.utility';

@Controller('api/admin/boosts')
export class BoostsController {

    @Get('context')
    @Middleware([AUTHORIZATION_MIDDLEWARE, BATTLE_NET_MIDDLEWARE, PermissionMiddleware.getPermissionMiddleware([RolePermission.CAN_LOGIN, RolePermission.CAN_CREATE_BOOST])])
    async getContext(req: InternalRequest, res: Response): Promise<void> {
        try {
            const canCollectPayment = await RoleRepository.newRepository().doUserHavePermission(req.user.discordId,
                [RolePermission.CAN_COLLECT_PAYMENTS], DiscordUtility.getRoleIds(req.client, req.user.discordId));

            res.status(StatusCodes.OK).json({
                canCollectPayment: canCollectPayment,
                realms: await RealmRepository.newRepository().getAll(),
                sources: Object.keys(BoostSource).map(key => BoostSource[key]),
                dungeons: Object.keys(Dungeon).map(key => Dungeon[key]),
                roles: Object.keys(Role).map(key => Role[key]),
                factions: Object.keys(Faction).map(key => Faction[key]),
                collectors: await this.getCollectors(req)
            });
        } catch (err) {
            console.error(err);
            res.status(StatusCodes.BAD_REQUEST).json();
        }
    }

    @Post()
    @Middleware([AUTHORIZATION_MIDDLEWARE, BATTLE_NET_MIDDLEWARE, PermissionMiddleware.getPermissionMiddleware([RolePermission.CAN_LOGIN, RolePermission.CAN_CREATE_BOOST])])
    async createBoost(req: InternalRequest<IBoostView>, res: Response): Promise<void> {
        try {
            const errors = await (new KeyBoostValidator()).run(req.user, req.body, req.client);
            if (errors.length > 0) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    isValidationErrors: true,
                    errors: errors
                });
                return;
            }

            const channel = await (req.client.channels.cache.get(process.env.DISCORD_CREATE_BOOST) as TextChannel);
            const message = await channel.send(`!mplus ${await this.getConvertedPayload(req.user, req.body)}`);
            const fallback = setTimeout(() => {
                req.client.off('messageReactionAdd', listener);
                res.status(StatusCodes.BAD_REQUEST).json([{
                    code: ValidationError.KEY_BOT_NO_REACTION,
                    message: 'Bot did not react'
                }]);
            }, 5000);
            const listener = (reaction: MessageReaction) => {
                if (reaction.message.id === message.id) {
                    clearTimeout(fallback);
                    req.client.off('messageReactionAdd', listener);
                    res.status(StatusCodes.OK).json();
                }
            };
            req.client.on('messageReactionAdd', listener);
        } catch (err) {
            console.error(err);
            res.status(StatusCodes.BAD_REQUEST).json();
        }
    }

    private async getConvertedPayload(user: InternalUser, entity: IBoostView): Promise<string> {
        return JSON.stringify({
            name: entity.boost.name,
            realm: entity.boost.realm.value.name,
            source: entity.boost.source.value,
            payments: entity.payments.map(payment => !payment.realm ? null : ({
                amount: payment.amount,
                realm: payment.realm.value.name,
                faction: payment.faction.value,
                collectorId: payment.collector ? payment.collector.value : user.discordId
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
                booster: key.keyHolder.user ? {
                    boosterId: key.keyHolder.user.value,
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

    private async getCollectors(req: InternalRequest): Promise<Array<ILabelValue<string>>> {
        const guild = req.client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
        const rolesThatCanCollect = await RoleRepository.newRepository().getRolesWithPermission(RolePermission.CAN_COLLECT_PAYMENTS);
        const values: Array<ILabelValue<string>> = [];
        for (const role of rolesThatCanCollect) {
            (await guild.roles.fetch(role.discordId)).members
                .forEach(item => {
                    if (values.some(value => value.value === item.id)) {
                        return;
                    }
                    values.push({ label: item.nickname ? item.nickname : item.displayName, value: item.id });
                });
        }
        return values;
    }
}
