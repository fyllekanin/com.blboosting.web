import { Controller, Get } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../../common/utilities/internal.request';
import { URL } from 'url';
import { BattleNetRegions, BattleNetService } from '../../common/apis/services/battle-net.service';
import { RequestUtility } from '../../common/utilities/request.utility';
import { UserRepository } from '../../common/persistance/repositories/user/user.repository';
import { ObjectId } from 'mongodb';
import { CharacterRepository } from '../../common/persistance/repositories/battle-net/character.repository';
import { Worker } from 'worker_threads';
import { WorkerEvents } from '../../common/constants/worker-events.enum';
import { StatusCodes } from 'http-status-codes';
import { IUserEntity } from '../../common/persistance/entities/user/user.entity';
import { BattleNetOauth2, BattleNetProfile, WoWCharacter } from '../../common/apis/interfaces/battle-net.interface';
import { ValidationError } from '../../common/constants/validation.error';

@Controller('api/battle-net')
export class BattleNetController {
    private static readonly FIVE_MINUTES = 1000 * 60 * 5;

    @Get('oauth')
    async connectBattleNet(req: InternalRequest, res: Response): Promise<void> {
        try {
            if (!req.query.token && !req.query.code) {
                res.send(this.getHtml({ payload: { isTokenMissing: true } }));
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

            const parsedToken = RequestUtility.getJWTValue(req.cookies.token);
            if (!parsedToken || !parsedToken.id) {
                res.send(this.getHtml({ payload: { isTokenMissing: true } }));
                return;
            }

            const result = await BattleNetService.getOath(BattleNetRegions.EU, req.query.code as string, 'wow.profile');
            if (!(result.scope || '').includes('wow.profile')) {
                res.status(StatusCodes.BAD_REQUEST).redirect('/default/error?message=You did not give access to your WoW profile. This is required');
                return;
            }
            const profile = await BattleNetService.getWoWProfile(BattleNetRegions.EU, result.access_token);
            if (!profile) {
                res.status(StatusCodes.BAD_REQUEST).redirect('/default/error?message=You have not granted the WoW profile access, remove bloostlust from authorized connections at <a href="https://account.battle.net/connections">https://account.battle.net/connections</a> and try again');
                return;
            }
            const usersWithId = await UserRepository.newRepository().getUsersWithBattleNetId(profile.id);
            const user = await UserRepository.newRepository().get(new ObjectId(parsedToken.id));

            if (usersWithId.length > 0 && usersWithId[0]._id.toString() !== user._id.toString()) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    isValidationErrors: true,
                    errors: [{
                        code: ValidationError.EXISTING_USER_WITH_BATTLE_NET_ID,
                        message: 'There is already a user with this account'
                    }]
                });
                return;
            }

            await this.addCharacters(result, profile, user);

            res.send(this.getHtml({ payload: { isSuccess: true } }));
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.BAD_REQUEST).redirect('/default/error?message=Contact administrator for support');
        }
    }

    private async addCharacters(battleNetOAUTH: BattleNetOauth2, profile: BattleNetProfile, user: IUserEntity): Promise<void> {
        user.battleNetId = profile.id;
        await UserRepository.newRepository().update(user);

        const characterRepository = new CharacterRepository();
        await characterRepository.removeCharactersForUserId(user._id);

        for (const account of profile.wow_accounts) {
            for (const character of account.characters) {
                if (character.level < 60) {
                    continue;
                }
                await this.addCharacter(characterRepository, user, character, account.id, battleNetOAUTH.access_token);
            }
        }
    }

    private async addCharacter(characterRepository: CharacterRepository, user: IUserEntity, character: WoWCharacter, accountId: number, battleNetToken: string): Promise<void> {
        const characterAssets = await BattleNetService.getCharacterAssets(BattleNetRegions.EU, character.realm.slug, character.name, battleNetToken);
        const entry = await characterRepository.insert({
            userId: user._id,
            battleNetId: user.battleNetId,
            accountId: accountId,
            characterId: character.id,
            name: character.name,
            realmSlug: character.realm.slug,
            class: character.playable_class.name,
            race: character.playable_race.name,
            faction: character.faction.type,
            level: character.level,
            characterAssets: {
                avatar: characterAssets?.avatar,
                inset: characterAssets?.inset,
                main: characterAssets?.main
            }
        });

        for (const event of [WorkerEvents.CHECK_RAIDER_IO_FOR, WorkerEvents.CHECK_RAID_LOGS_FOR]) {
            const worker = new Worker(`${__dirname}/../../task-runner/main.js`, {
                workerData: { type: event, data: { documentId: entry._id.toString() } }
            });
            worker.once('message', result => console.log(result));
            worker.once('exit', exitCode => console.log(exitCode));
        }
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
