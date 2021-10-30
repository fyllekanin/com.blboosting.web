import { NextFunction, Response } from 'express';
import { InternalRequest } from '../../utilities/internal.request';
import { UserRepository } from '../../persistance/repositories/user/user.repository';
import { ObjectId } from 'mongodb';

export const BATTLE_NET_MIDDLEWARE = async (req: InternalRequest, res: Response, next: NextFunction) => {
    const user = await UserRepository.newRepository().get(new ObjectId(req.user.id));

    /** Disabled for now
     if (user && !user.battleNetId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            isMissingBattleNet: true
        });
        return;
    }*/
    next();
};
