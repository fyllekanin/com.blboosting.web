import { ObjectId } from 'mongodb';
import { CharacterRepository } from '../../common/persistance/repositories/battle-net/character.repository';
import { RaiderIoService } from '../../common/apis/services/raider-io.service';
import { BattleNetRegions } from '../../common/apis/services/battle-net.service';
import { ITask } from '../task.interface';

export class UpdateRaiderIoEvent implements ITask {
    private characterRepository = new CharacterRepository();
    private data: { documentId: ObjectId };

    constructor(data: { documentId: ObjectId }) {
        this.data = data;
        console.log(`Data in event: ${JSON.stringify(this.data)}`);
    }

    async start(): Promise<void> {
        const character = await this.characterRepository.get(this.data.documentId);
        const raiderId = await RaiderIoService.getCharacter(BattleNetRegions.EU, character.realmSlug, character.name);
        if (!raiderId) {
            return;
        }

        character.raiderIo = {
            tank: raiderId.mythic_plus_scores_by_season[0].scores.tank,
            healer: raiderId.mythic_plus_scores_by_season[0].scores.healer,
            dps: raiderId.mythic_plus_scores_by_season[0].scores.dps,
            all: raiderId.mythic_plus_scores_by_season[0].scores.all
        };

        await this.characterRepository.update(character);
    }
}