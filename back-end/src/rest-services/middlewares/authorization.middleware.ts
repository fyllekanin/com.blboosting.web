import { NextFunction, Response } from 'express';
import { InternalRequest } from '../../utilities/internal.request';

export const AUTHORIZATION_MIDDLEWARE = async (req: InternalRequest, res: Response, next: NextFunction) => {
    next();
};
