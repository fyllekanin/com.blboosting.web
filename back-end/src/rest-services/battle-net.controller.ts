import { Controller, Get } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../utilities/internal.request';
import { URL } from 'url';
import { BattleNetRegions, BattleNetService } from '../apis/services/battle-net.service';
import { RequestUtility } from '../utilities/request.utility';
import { UserRepository } from '../persistance/repositories/user/user.repository';
import { ObjectId } from 'mongodb';

@Controller('api/battle-net')
export class BattleNetController {
    private static readonly FIVE_MINUTES = 1000 * 60 * 5;

    @Get('oauth')
    async connectBattleNet(req: InternalRequest, res: Response): Promise<void> {
        if (!req.query.token && !req.query.code) {
            res.send(this.getHtml({ isTokenMissing: true }));
            return;
        }
        if (!req.query.code) {
            const myUrl = new URL(process.env.BATTLE_NET_OAUTH_LINK);
            myUrl.searchParams.append('response_type', 'code');
            myUrl.searchParams.append('client_id', process.env.BATTLE_NET_CLIENT_ID);
            myUrl.searchParams.append('redirect_uri', `${process.env.APPLICATION_URL}/api/battle-net/oauth`);
            myUrl.searchParams.append('scope', 'wow.profile');
            res.cookie('token', req.query.token, {
                maxAge: BattleNetController.FIVE_MINUTES,
                httpOnly: true
            });
            res.redirect(myUrl.href);
            return;
        }
        const result = await BattleNetService.getOath(BattleNetRegions.EU, req.query.code as string, 'wow.profile');
        const profile = await BattleNetService.getWoWProfile(BattleNetRegions.EU, result.access_token);

        const parsedToken = RequestUtility.getJWTValue(req.cookies.token);
        const user = await UserRepository.newRepository().get(new ObjectId(parsedToken.id));
        user.battleNetId = profile.id;
        await UserRepository.newRepository().update(user);

        res.send(this.getHtml({ isSuccess: true }));
    }

    private getHtml(payload: Object): string {
        return `
        <!DOCTYPE HTML>
        <html>
            <body>
                <script type="application/javascript">
                    window.opener.postMessage(${JSON.stringify(payload)}, '${process.env.NODE_ENV === 'production' ? process.env.APPLICATION_URL : 'http://localhost:4200'}');
                </script>
            </body>
        </html>`;
    }
}
