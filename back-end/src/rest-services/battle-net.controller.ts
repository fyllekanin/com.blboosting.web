import { Controller, Get } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../utilities/internal.request';
import { URL } from 'url';
import { BattleNetRegions, BattleNetService } from '../apis/services/battle-net.service';

@Controller('api/battle-net')
export class BattleNetController {

    @Get('oauth')
    async connectBattleNet(req: InternalRequest, res: Response): Promise<void> {
        if (!req.query.code) {
            const myUrl = new URL(process.env.BATTLE_NET_OAUTH_LINK);
            myUrl.searchParams.append('response_type', 'code');
            myUrl.searchParams.append('client_id', process.env.BATTLE_NET_CLIENT_ID);
            myUrl.searchParams.append('redirect_uri', `${process.env.APPLICATION_URL}/api/battle-net/oauth?token=${req.query.token}`);
            myUrl.searchParams.append('scope', 'wow.profile');
            res.redirect(myUrl.href);
            return;
        }
        const result = await BattleNetService.getOath(BattleNetRegions.EU, req.query.code as string, 'wow.profile');
        const profile = await BattleNetService.getWoWProfile(BattleNetRegions.EU, result.access_token);
        // result = await DiscordService.getOauth(req.query.code as string);
        // const discord = await DiscordService.getDiscordUser(result);

        res.send(`
        <!DOCTYPE HTML>
        <html>
            <body>
                <script type="application/javascript">
                    window.opener.postMessage(${JSON.stringify(null)}, '${process.env.NODE_ENV === 'production' ? process.env.APPLICATION_URL : 'http://localhost:4200'}');
                </script>
            </body>
        </html>
        `);
    }
}
