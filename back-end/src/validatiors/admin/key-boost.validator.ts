import { IValidationError, IValidator } from '../validator.interface';
import { IBoostView } from '../../rest-service-views/admin/boosts.interface';
import { InternalRequest } from '../../utilities/internal.request';
import { ValidationError } from '../../constants/validation.error';

export class KeyBoostValidator implements IValidator<IBoostView> {

    async run(req: InternalRequest<IBoostView>, entity: IBoostView): Promise<Array<IValidationError>> {
        const errors: Array<IValidationError> = [];

        await this.validateContactCharacter(entity, errors);
        await this.validatePlayAlong(req, entity, errors);
        await this.validatePayments(entity, errors);
        await this.validateKeys(entity, errors);

        return errors;
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
        if (!entity.playAlong.name) {
            return;
        }
        if (!entity.playAlong.realm) {
            errors.push({
                code: ValidationError.KEY_PLAY_ALONG_REALM,
                message: 'You need to fill in realm for play along'
            });
        }
        if (!entity.playAlong.role) {
            errors.push({
                code: ValidationError.KEY_PLAY_ALONG_ROLE,
                message: 'You need to fill in role for play along'
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