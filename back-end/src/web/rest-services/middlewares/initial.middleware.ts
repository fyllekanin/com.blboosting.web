import { NextFunction, Response } from 'express';
import { InternalRequest } from '../../../common/utilities/internal.request';
import { RequestUtility } from '../../../common/utilities/request.utility';

export function INITIAL_MIDDLEWARE(req: InternalRequest, res: Response, next: NextFunction) {
    const authHeader = req.header('authorization');
    const token = authHeader ? authHeader.split(' ')[1] : null;

    if (!token) {
        req.user = {
            id: null,
            discordId: null,
            token: null
        };
        next();
        return;
    }
    const user = RequestUtility.getJWTValue(token);

    if (!user) {
        req.user = {
            id: null,
            discordId: null,
            token: token
        };
        next();
        return;
    }
    req.user = {
        id: user.id,
        discordId: user.discordId,
        token: token
    };
    next();
}