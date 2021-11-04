import { InternalUser } from '../../common/utilities/internal.request';
import { Client } from 'discord.js';

export interface IValidationError {
    code: number;
    message: string;
}

export interface IValidator<T> {
    run(user: InternalUser, entity: T, client?: Client): Promise<Array<IValidationError>>
}
