import { RaiderIoCharacter } from '../interfaces/raider-io.interface';
import axios from 'axios';

export class RaiderIoService {
    private static readonly BASE_URL = 'https://raider.io/api/v1';

    static async getCharacter(region: string, realm: string, name: string): Promise<RaiderIoCharacter> {
        const result = await axios.get(`${this.BASE_URL}/characters/profile`, {
            params: {
                name: name,
                realm: realm,
                region: region,
                fields: 'mythic_plus_scores_by_season:current,covenant'
            }
        }).catch(err => {
            console.error(`RaiderIO error!`);
            console.error(`Arguments: ${region}, ${realm}, ${name}`);
            console.error(`Error: ${err}`);
            return { data: null };
        });
        return result.data as RaiderIoCharacter;
    }
}