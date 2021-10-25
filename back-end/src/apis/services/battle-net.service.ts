import axios from 'axios';
import { BattleNetOauth2, BattleNetRealm, BattleNetRealms } from '../interfaces/battle-net.interface';
import { URLSearchParams } from 'url';

export enum BattleNetRegions {
    EU = 'eu'
}

let ACCESS_TOKEN: string = null

export class BattleNetService {
    private static readonly BASE_URL = 'https://{{REGION}}.api.blizzard.com';
    private static readonly AUTH_URL = 'https://eu.battle.net/oauth/token';

    static async getRealm(region: BattleNetRegions, slug: string): Promise<BattleNetRealm> {
        const queryParams = [
            `namespace=dynamic-${region}`,
            `locale=en_US`
        ].join('&');
        return await this.getData<BattleNetRealm>(region, `/data/wow/realm/${slug}`, queryParams);
    }

    static async getRealmList(region: BattleNetRegions): Promise<BattleNetRealms> {
        const queryParams = [
            `namespace=dynamic-${region}`,
            `locale=en_US`
        ].join('&');
        return await this.getData<BattleNetRealms>(region, '/data/wow/realm/index', queryParams);
    }

    private static async getData<T>(region: BattleNetRegions, path: string, queryParameters: string): Promise<T> {
        if (!ACCESS_TOKEN) {
            ACCESS_TOKEN = `Bearer ${(await this.getOauth()).access_token}`;
        }
        return await axios.get(`${BattleNetService.BASE_URL.replace('{{REGION}}', region)}${path}?${queryParameters}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: ACCESS_TOKEN
            }
        })
            .then(async result => result.data).catch(err => {
                console.error(`BattleNet getData error: ${err}`);
                if (err.response && err.response.status === 401) {
                    ACCESS_TOKEN = null;
                    return this.getData(region, path, queryParameters);
                }
            });
    }

    private static async getOauth(): Promise<BattleNetOauth2> {
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');

        return await axios.post(BattleNetService.AUTH_URL, params, {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${process.env.BATTLE_NET_CLIENT_ID}:${process.env.BATTLE_NET_CLIENT_SECRET}`)
                    .toString('base64')
            }
        }).then(result => {
            return result.data;
        }).catch(err => {
            console.error(`BattleNet oauth: ${err}`);
        });
    }
}