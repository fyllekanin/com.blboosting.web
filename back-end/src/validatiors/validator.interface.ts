import { InternalRequest } from '../utilities/internal.request';

export interface IValidationError {
    code: number;
    message: string;
}

export interface IValidator<T> {
    run(req: InternalRequest, entity: T): Promise<Array<IValidationError>>
}
