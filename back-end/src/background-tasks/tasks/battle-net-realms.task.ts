import { IBackgroundTask } from '../background-task.interface';
import { BattleNetRegions, BattleNetService } from '../../apis/services/battle-net.service';
import { RealmRepository } from '../../persistance/repositories/battle-net/realm.repository';
import { IRealmEntity } from '../../persistance/entities/battle-net/realm.entity';
import { BattleNetConnectedRealm, SlimBattleNetRealm } from '../../apis/interfaces/battle-net.interface';

export class BattleNetRealmsTask implements IBackgroundTask {
    getSchedule(): string {
        return '0 */24 * * *';
    }

    async run(): Promise<void> {
        const repository = new RealmRepository();
        const realms = await BattleNetService.getRealmList(BattleNetRegions.EU);
        const connectedRealms = await BattleNetService.getConnectedRealmList(BattleNetRegions.EU);
        const promises: Array<Promise<void>> = [];

        const existingRealms = await repository.getAll();
        for (const realm of realms.realms) {
            const existingItem = existingRealms.find(item => item.realmId === realm.id);
            if (existingItem) {
                promises.push(this.updateIfApplicable(repository, existingItem, connectedRealms));
            } else {
                promises.push(this.addRealm(repository, realm, connectedRealms));
            }
        }
        await Promise.all(promises).then(() => console.log('Realm task done'));
    }

    private async addRealm(repository: RealmRepository, slimRealm: SlimBattleNetRealm, connectedRealms: Array<BattleNetConnectedRealm>): Promise<void> {
        const connected = connectedRealms.find(item => item.realms.some(child => child.id === slimRealm.id));
        const realm = await BattleNetService.getRealm(BattleNetRegions.EU, slimRealm.slug);

        const entity: IRealmEntity = {
            realmId: slimRealm.id,
            slug: slimRealm.slug,
            name: slimRealm.name,
            isTournament: realm.isTournament,
            timezone: realm.timezone,
            category: realm.category,
            connectedId: connected?.id,
            connectedTo: connected ? connected.realms.map(item => item.id) : []
        };
        await repository.insert(entity);
    }

    private async updateIfApplicable(repository: RealmRepository, realm: IRealmEntity, connectedRealms: Array<BattleNetConnectedRealm>): Promise<void> {
        const connected = connectedRealms.find(item => item.id === realm.connectedId);
        const connectedIds = connected ? connected.realms.map(item => item.id) : [];
        if (!connected || realm.connectedTo.sort().join() === connectedIds.sort().join()) {
            return;
        }
        realm.connectedTo = connected.realms.map(item => item.id);
        await repository.update(realm);
    }
}