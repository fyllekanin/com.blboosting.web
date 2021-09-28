import { NextFunction, Response } from 'express';
import { InternalRequest } from '../../utilities/internal.request';
import { StatusCodes } from 'http-status-codes';

export const AUTHORIZATION_MIDDLEWARE = async (req: InternalRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.id || !req.user.token) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            isTokenExisting: Boolean(req.user.token)
        });
        return;
    }
    next();
};
