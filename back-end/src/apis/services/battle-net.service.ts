import axios from 'axios';
import {
    BattleNetConnectedRealm,
    BattleNetOauth2,
    BattleNetRealm,
    BattleNetRealms
} from '../interfaces/battle-net.interface';
import { URLSearchParams } from 'url';

export enum BattleNetRegions {
    EU = 'eu'
}

export class BattleNetService {
    private static ACCESS_TOKEN: string = null;
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

    static async getConnectedRealmList(region: BattleNetRegions): Promise<Array<BattleNetConnectedRealm>> {
        const queryParams = [
            `namespace=dynamic-${region}`,
            `locale=en_US`
        ].join('&');
        const indexes = await this.getData<{ connected_realms: Array<{ href: string }> }>(region, '/data/wow/connected-realm/index', queryParams);
        const indexIds = indexes.connected_realms.map(item => item.href.match(/([0-9]+)/)[0]);
        const connectedRealms: Array<BattleNetConnectedRealm> = [];

        for (const indexId of indexIds) {
            connectedRealms.push(await this.getData<BattleNetConnectedRealm>(region, `/data/wow/connected-realm/${indexId}`, queryParams));
        }
        return connectedRealms;
    }

    private static async getData<T>(region: BattleNetRegions, path: string, queryParameters: string): Promise<T> {
        if (!BattleNetService.ACCESS_TOKEN) {
            BattleNetService.ACCESS_TOKEN = `Bearer ${(await this.getOauth()).access_token}`;
        }
        return await axios.get(`${BattleNetService.BASE_URL.replace('{{REGION}}', region)}${path}?${queryParameters}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: BattleNetService.ACCESS_TOKEN
            }
        })
            .then(async result => result.data).catch(err => {
                console.error(`BattleNet getData error: ${err}`);
                if (err.response.status === 401) {
                    BattleNetService.ACCESS_TOKEN = null;
                    return this.getRealmList(region);
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