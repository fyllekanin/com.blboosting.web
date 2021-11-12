import { IValidationError, IValidator } from '../validator.interface';
import { IBoostView } from '../../rest-service-views/admin/boosts.interface';
import { InternalUser } from '../../../common/utilities/internal.request';
import { ValidationError } from '../../../common/constants/validation.error';
import { Role } from '../../../common/constants/roles.constant';
import { Client } from 'discord.js';
import { Dungeon } from '../../../common/constants/dungeons.constant';
import { RoleRepository } from '../../../common/persistance/repositories/role.repository';
import { RolePermission } from '../../../common/persistance/entities/role.entity';
import { DiscordUtility } from '../../../common/utilities/discord.utility';

export class KeyBoostValidator implements IValidator<IBoostView> {

    async run(user: InternalUser, entity: IBoostView, client: Client): Promise<Array<IValidationError>> {
        const errors: Array<IValidationError> = [];

        await this.validateContactCharacter(entity, errors);
        await this.validatePlayAlong(user, entity, errors);
        await this.validatePayments(user, entity, client, errors);
        await this.validateKeys(entity, errors);
        await this.validateRoles(user, entity, errors);

        return errors;
    }

    private async validateRoles(user: InternalUser, entity: IBoostView, errors: Array<IValidationError>): Promise<void> {
        const playAlongRole = entity.playAlong.isPlaying ? entity.playAlong.role : null;
        const tanks = new Set(entity.keys
            .filter(key => key.keyHolder && key.keyHolder.discordId && key.keyHolder.role && key.keyHolder.role === Role.TANK.value)
            .map(key => key.keyHolder.discordId));
        const healers = new Set(entity.keys
            .filter(key => key.keyHolder && key.keyHolder.discordId && key.keyHolder.role && key.keyHolder.role === Role.HEALER.value)
            .map(key => key.keyHolder.discordId));
        const dps = new Set(entity.keys
            .filter(key => key.keyHolder && key.keyHolder.discordId && key.keyHolder.role && key.keyHolder.role === Role.DPS.value)
            .map(key => key.keyHolder.discordId));
        if (playAlongRole === Role.TANK.value) tanks.add(user.discordId);
        if (playAlongRole === Role.HEALER.value) healers.add(user.discordId);
        if (playAlongRole === Role.DPS.value) dps.add(user.discordId);

        if (tanks.size > 1) {
            errors.push({
                code: ValidationError.KEY_MULTIPLE_SAME_ROLE,
                message: 'Only one user can be tank'
            });
        }
        if (healers.size > 1) {
            errors.push({
                code: ValidationError.KEY_MULTIPLE_SAME_ROLE,
                message: 'Only one user can be healer'
            });
        }
        if (dps.size > 2) {
            errors.push({
                code: ValidationError.KEY_MULTIPLE_SAME_ROLE,
                message: 'Only two users can be DPS'
            });
        }
    }

    private async validateContactCharacter(entity: IBoostView, errors: Array<IValidationError>): Promise<void> {
        if (!entity.boost.name) {
            errors.push({
                code: ValidationError.KEY_BOOST_NAME,
                message: 'Name of your contact character needs to be filled in'
            });
        }
        if (!entity.boost.realmId) {
            errors.push({
                code: ValidationError.KEY_BOOST_REALM,
                message: 'Realm for your contact character needs to be filled in'
            });
        }
        if (!entity.boost.source) {
            errors.push({
                code: ValidationError.KEY_BOOST_SOURCE,
                message: 'The source where you found the buyer needs to be filled in'
            });
        }
    }

    private async validatePlayAlong(user: InternalUser, entity: IBoostView, errors: Array<IValidationError>): Promise<void> {
        if (!entity.playAlong.isPlaying) {
            return;
        }
        if (!entity.playAlong.role) {
            errors.push({
                code: ValidationError.KEY_PLAY_ALONG_ROLE,
                message: 'You need to fill in role for play along'
            });
        }
        if ([Role.TANK.value, Role.HEALER.value].includes(entity.playAlong.role) &&
            entity.keys.some(key => key.keyHolder && key.keyHolder.discordId && key.keyHolder.role === entity.playAlong.role)) {
            errors.push({
                code: ValidationError.KEY_MULTIPLE_SAME_ROLE,
                message: 'You can not be tank or healer if a key holder is this role'
            });
        }
        if (entity.keys.some(key => key.keyHolder && key.keyHolder.discordId && key.keyHolder.discordId === user.discordId)) {
            errors.push({
                code: ValidationError.KEY_PLAY_ALONG_KEY_HOLDER,
                message: 'You can not choose to play along and be key holder, choose one'
            });
        }
    }

    private async validatePayments(user: InternalUser, entity: IBoostView, client: Client, errors: Array<IValidationError>): Promise<void> {
        if (entity.balancePayment && entity.balancePayment < 0) {
            errors.push({ code: ValidationError.KEY_PAYMENT_BALANCE, message: 'Balance payment can not be negative' });
        }
        const canCollectPayments = await RoleRepository.newRepository().doUserHavePermission(user.discordId,
            [RolePermission.CAN_COLLECT_PAYMENTS], DiscordUtility.getRoleIds(client, user.discordId));

        for (const payment of entity.payments) {
            if (!entity.balancePayment && (!payment.amount || payment.amount <= 0)) {
                errors.push({
                    code: ValidationError.KEY_PAYMENT_AMOUNT,
                    message: 'A payment amount can not be empty or 0'
                });
            }
            if (!entity.balancePayment && !payment.realmId) {
                errors.push({ code: ValidationError.KEY_PAYMENT_REALM, message: 'A payment realm needs to be picked' });
            }
            if (!entity.balancePayment && payment.amount < 1000) {
                errors.push({
                    code: ValidationError.KEY_PAYMENT_AMOUNT,
                    message: 'A payment amount can not be less then 1000'
                });
            }
            if (!entity.balancePayment && !payment.faction) {
                errors.push({
                    code: ValidationError.KEY_PAYMENT_FACTION,
                    message: 'A payment faction needs to be picked'
                });
            }
            if (!entity.balancePayment && !payment.collectorDiscordId && !canCollectPayments) {
                errors.push({
                    code: ValidationError.KEY_PAYMENT_COLLECTOR,
                    message: 'Collector is missing, you are not able to collect yourself'
                });
            }
        }
    }

    private async validateKeys(entity: IBoostView, errors: Array<IValidationError>): Promise<void> {
        for (const key of entity.keys) {
            if (!key.level || (key.level < 0)) {
                errors.push({
                    code: ValidationError.KEY_KEY_LEVEL,
                    message: 'A key level can not be a negative number'
                });
            }
            if (!key.dungeon) {
                errors.push({ code: ValidationError.KEY_KEY_DUNGEON, message: 'A key dungeon needs to be picked' });
            }
            if (key.keyHolder && key.keyHolder.discordId && !key.keyHolder.role) {
                errors.push({
                    code: ValidationError.KEY_KEY_HOLDER,
                    message: 'A key holder needs to have a role selected'
                });
            }
        }
        const specificKeys = entity.keys.filter(key => key.dungeon && key.dungeon !== Dungeon.ANY.value);
        if (specificKeys.length > 1 && specificKeys.some(key => !key.keyHolder || !key.keyHolder.discordId)) {
            errors.push({
                code: ValidationError.KEY_KEY_MULTIPLE_SPECIFIC,
                message: 'If multiple specific keys every specific key needs a keyholder'
            });
        }
    }
}