import { NextFunction, Response } from 'express';
import { InternalRequest } from '../../utilities/internal.request';
import { verify } from 'jsonwebtoken';

export async function INITIAL_MIDDLEWARE(req: InternalRequest, res: Response, next: NextFunction) {
    const authHeader = req.header('authorization');
    const token = authHeader ? authHeader.split(' ')[1] : null;

    if (!token) {
        req.user = {
            userId: null,
            token: null
        };
        next();
        return;
    }
    const user = verify(token, process.env.TOKEN_SECRET) as { id: string };

    if (!user) {
        req.user = {
            userId: null,
            token: token
        };
        next();
        return;
    }
    req.user = {
        userId: user.id,
        token: token
    };
    next();
}