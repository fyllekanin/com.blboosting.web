import axios from 'axios';
import { BattleNetOauth2, BattleNetProfile, BattleNetRealm, BattleNetRealms } from '../interfaces/battle-net.interface';
import { URLSearchParams } from 'url';
import FormData from 'form-data';

export enum BattleNetRegions {
    EU = 'eu'
}

let ACCESS_TOKEN: string = null

export class BattleNetService {
    private static readonly BASE_URL = 'https://{{REGION}}.api.blizzard.com';
    private static readonly AUTH_URL = 'https://{{REGION}}.battle.net/oauth/token';

    static async getOath(region: BattleNetRegions, code: string, scope: string): Promise<BattleNetOauth2> {
        const formData = new FormData();
        formData.append('code', code);
        formData.append('redirect_uri', `${process.env.APPLICATION_URL}/api/battle-net/oauth`);
        formData.append('scope', scope);
        formData.append('grant_type', 'authorization_code');

        return await axios.post(BattleNetService.AUTH_URL.replace('{{REGION}}', region), formData, {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${process.env.BATTLE_NET_CLIENT_ID}:${process.env.BATTLE_NET_CLIENT_SECRET}`)
                    .toString('base64'),
                'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`
            }
        }).then(result => {
            return result.data;
        }).catch(err => {
            console.error(`BattleNet oauth: ${err}`);
        });
    }

    static async getWoWProfile(region: BattleNetRegions, accessToken: string): Promise<BattleNetProfile> {
        return await axios.get(`${BattleNetService.BASE_URL.replace('{{REGION}}', region)}/profile/user/wow`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                namespace: 'profile-eu',
                locale: 'en_US'
            }
        })
            .then(result => result.data);
    }

    static async getCharacterAssets(region: BattleNetRegions, slug: string, character: string, accessToken: string): Promise<{
        avatar: string;
        inset: string;
        main: string;
    }> {
        const characterName = encodeURI(character.toLowerCase());
        return await axios.get(`${BattleNetService.BASE_URL.replace('{{REGION}}', region)}/profile/wow/character/${slug}/${characterName}/character-media`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                namespace: `profile-${region}`,
                locale: 'en_US'
            }
        })
            .then((result: { data: { assets: [{ key: string, value: string }] } }) => ({
                avatar: result.data.assets.find(item => item.key === 'avatar').value,
                inset: result.data.assets.find(item => item.key === 'inset').value,
                main: result.data.assets.find(item => item.key === 'main').value
            }));
    }

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
            ACCESS_TOKEN = `Bearer ${(await this.getApplicationOauth(region)).access_token}`;
        }
        const url = `${BattleNetService.BASE_URL.replace('{{REGION}}', region)}${path}?${queryParameters}`;
        return await axios.get(url, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: ACCESS_TOKEN
            }
        })
            .then(result => result.data).catch(err => {
                console.error(`BattleNet getData error: ${err}`);
                if (err.response && err.response.status === 401) {
                    ACCESS_TOKEN = null;
                    return this.getData(region, path, queryParameters);
                }
            });
    }

    private static async getApplicationOauth(region: BattleNetRegions): Promise<BattleNetOauth2> {
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');

        return await axios.post(BattleNetService.AUTH_URL.replace('{{REGION}}', region), params, {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${process.env.BATTLE_NET_CLIENT_ID}:${process.env.BATTLE_NET_CLIENT_SECRET}`)
                    .toString('base64')
            }
        }).then(result => {
            return result.data;
        }).catch(err => {
            console.error(`BattleNet application oauth: ${err}`);
        });
    }
}