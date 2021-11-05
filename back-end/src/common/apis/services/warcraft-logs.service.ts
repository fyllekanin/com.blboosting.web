import { IWarcraftLogsInterface } from '../interfaces/warcraft-logs.interface';
import axios from 'axios';
import { URLSearchParams } from 'url';

export class WarcraftLogsService {
    private static TOKEN: string;

    private static async getToken(): Promise<string> {
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');

        const result = await axios.post('https://www.warcraftlogs.com/oauth/token', params, {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${process.env.WARCRAFTLOGS_CLIENT_ID}:${process.env.WARCRAFTLOGS_CLIENT_SECRET}`)
                    .toString('base64')
            }
        });
        return `Bearer ${result.data.access_token}`;
    }

    static async getCharacter(id: number): Promise<IWarcraftLogsInterface> {
        if (!this.TOKEN) {
            this.TOKEN = await this.getToken();
        }
        const result = await axios.post('https://www.warcraftlogs.com/api/v2/client', {
            query: `
                {
                  characterData {
                    character(id: ${id}) {
                      name
                      gameData
                      zoneRankings(difficulty: 4)
                    }
                  }
                }`
        }, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: this.TOKEN
            }
        });
        if (result.status === 401) {
            return this.getCharacter(id);
        }
        return result.data as IWarcraftLogsInterface;
    }
}