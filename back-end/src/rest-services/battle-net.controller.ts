import { Controller, Get } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../utilities/internal.request';

@Controller('api/battle-net')
export class BattleNetController {

    @Get('oauth')
    async getDiscord(req: InternalRequest, res: Response): Promise<void> {
        if (!req.query.code) {
            const redirectUri = encodeURIComponent(`${process.env.APPLICATION_URL}/api/battle-net/oauth?token=${req.query.token}`);
            res.redirect(`${process.env.BATTLE_NET_OAUTH_LINK}/?response_type=code&client_id=${process.env.BATTLE_NET_CLIENT_ID}&redirect_uri=${redirectUri}&scope=wow.profile`);
            return;
        }
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
