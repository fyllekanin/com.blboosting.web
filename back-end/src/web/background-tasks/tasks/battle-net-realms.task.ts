import { IBackgroundTask } from '../background-task.interface';
import { BattleNetRegions, BattleNetService } from '../../../common/apis/services/battle-net.service';
import { RealmRepository } from '../../../common/persistance/repositories/battle-net/realm.repository';
import { IRealmEntity } from '../../../common/persistance/entities/battle-net/realm.entity';
import { SlimBattleNetRealm } from '../../../common/apis/interfaces/battle-net.interface';

export class BattleNetRealmsTask implements IBackgroundTask {
    getSchedule(): string {
        return '0 */24 * * *';
    }

    async run(): Promise<void> {
        const repository = new RealmRepository();
        const realms = await BattleNetService.getRealmList(BattleNetRegions.EU);

        const newRealms: Array<IRealmEntity> = [];
        for (const realm of realms.realms) {
            const isRealmAdded = await repository.doRealmWithIdExist(realm.id);
            if (!isRealmAdded) {
                newRealms.push(await this.getNewRealmEntity(realm));
            }
        }
        const realmsToInsert = newRealms.filter(item => item);
        if (realmsToInsert.length > 0) {
            for (const realm of realmsToInsert) {
                await repository.insert(realm);
            }
            console.log('Realm task done');
        } else {
            console.log('Realm task done');
        }
    }

    private async getNewRealmEntity(slimRealm: SlimBattleNetRealm): Promise<IRealmEntity> {
        return {
            realmId: slimRealm.id,
            slug: slimRealm.slug,
            name: slimRealm.name
        };
    }
}