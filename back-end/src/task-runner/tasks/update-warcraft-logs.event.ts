import { ObjectId } from 'mongodb';
import { CharacterRepository } from '../../common/persistance/repositories/battle-net/character.repository';
import { ITask } from '../task.interface';
import { WarcraftLogsService } from '../../common/apis/services/warcraft-logs.service';

export class UpdateWarcraftLogsEvent implements ITask {
    private characterRepository = new CharacterRepository();
    private data: { documentId: ObjectId };

    constructor(data: { documentId: ObjectId }) {
        this.data = data;
    }

    async start(): Promise<void> {
        const character = await this.characterRepository.get(this.data.documentId);
        const warcraftLogs = await WarcraftLogsService.getCharacter(character.characterId);

        character.raid = {
            bestPerformanceAverage: warcraftLogs?.data?.characterData?.character?.zoneRankings?.bestPerformanceAverage || 0
        };

        await this.characterRepository.update(character);
    }
}