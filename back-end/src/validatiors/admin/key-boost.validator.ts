import { IValidationError, IValidator } from '../validator.interface';
import { IBoostView } from '../../rest-service-views/admin/boosts.interface';
import { InternalRequest, InternalUser } from '../../utilities/internal.request';
import { ValidationError } from '../../constants/validation.error';
import { Role } from '../../constants/roles.constant';

export class KeyBoostValidator implements IValidator<IBoostView> {

    async run(req: InternalRequest<IBoostView>, entity: IBoostView): Promise<Array<IValidationError>> {
        const errors: Array<IValidationError> = [];

        await this.validateContactCharacter(entity, errors);
        await this.validatePlayAlong(req, entity, errors);
        await this.validatePayments(entity, errors);
        await this.validateKeys(entity, errors);
        await this.validateRoles(req.user, entity, errors);

        return errors;
    }

    private async validateRoles(user: InternalUser, entity: IBoostView, errors: Array<IValidationError>): Promise<void> {
        const playAlongRole = entity.playAlong.isPlaying ? entity.playAlong.role.value : null;
        const tanks = new Set(entity.keys
            .filter(key => key.keyHolder && key.keyHolder.user && key.keyHolder.role && key.keyHolder.role.value === Role.TANK.value)
            .map(key => key.keyHolder.user.value.discordId));
        const healers = new Set(entity.keys
            .filter(key => key.keyHolder && key.keyHolder.user && key.keyHolder.role && key.keyHolder.role.value === Role.HEALER.value)
            .map(key => key.keyHolder.user.value.discordId));
        const dps = new Set(entity.keys
            .filter(key => key.keyHolder && key.keyHolder.user && key.keyHolder.role && key.keyHolder.role.value === Role.DPS.value)
            .map(key => key.keyHolder.user.value.discordId));
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
        if (!entity.boost.realm) {
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

    private async validatePlayAlong(req: InternalRequest<IBoostView>, entity: IBoostView, errors: Array<IValidationError>): Promise<void> {
        if (!entity.playAlong.isPlaying) {
            return;
        }
        if (!entity.playAlong.role) {
            errors.push({
                code: ValidationError.KEY_PLAY_ALONG_ROLE,
                message: 'You need to fill in role for play along'
            });
        }
        if ([Role.TANK.value, Role.HEALER.value].includes(entity.playAlong.role.value) &&
            entity.keys.some(key => key.keyHolder && key.keyHolder.user && key.keyHolder.role.value === entity.playAlong.role.value)) {
            errors.push({
                code: ValidationError.KEY_MULTIPLE_SAME_ROLE,
                message: 'You can not be tank or healer if a key holder is this role'
            });
        }
        if (entity.keys.some(key => key.keyHolder && key.keyHolder.user && key.keyHolder.user.value.discordId === req.user.discordId)) {
            errors.push({
                code: ValidationError.KEY_PLAY_ALONG_KEY_HOLDER,
                message: 'You can not choose to play along and be key holder, choose one'
            });
        }
    }

    private async validatePayments(entity: IBoostView, errors: Array<IValidationError>): Promise<void> {
        if (entity.balancePayment && entity.balancePayment < 0) {
            errors.push({ code: ValidationError.KEY_PAYMENT_BALANCE, message: 'Balance payment can not be negative' });
        }
        for (const payment of entity.payments) {
            if (!entity.balancePayment && (!payment.amount || payment.amount <= 0)) {
                errors.push({
                    code: ValidationError.KEY_PAYMENT_AMOUNT,
                    message: 'A payment amount can not be empty or 0'
                });
            }
            if (!entity.balancePayment && !payment.realm) {
                errors.push({ code: ValidationError.KEY_PAYMENT_REALM, message: 'A payment realm needs to be picked' });
            }
            if (payment.amount < 1000) {
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
        }
    }

    private async validateKeys(entity: IBoostView, errors: Array<IValidationError>): Promise<void> {
        for (const key of entity.keys) {
            if (!key.level || (key.level.value < 0)) {
                errors.push({
                    code: ValidationError.KEY_KEY_LEVEL,
                    message: 'A key level can not be a negative number'
                });
            }
            if (!key.dungeon) {
                errors.push({ code: ValidationError.KEY_KEY_DUNGEON, message: 'A key dungeon needs to be picked' });
            }
            if (key.keyHolder && key.keyHolder.user && !key.keyHolder.role) {
                errors.push({
                    code: ValidationError.KEY_KEY_HOLDER,
                    message: 'A key holder needs to have a role selected'
                });
            }
        }

    }
}
