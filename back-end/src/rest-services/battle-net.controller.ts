import { Controller, Get } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../utilities/internal.request';

@Controller('api/battle-net')
export class BattleNetController {

    @Get('auth')
    async getDiscord(req: InternalRequest, res: Response): Promise<void> {
        if (!req.query.code) {
            res.redirect(process.env.DISCORD_OAUTH_LINK);
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
