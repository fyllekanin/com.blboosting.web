import { SettingEntity, SettingKey } from '../../../../src/persistance/entities/settings/setting.entity';

describe('SettingEntity', () => {

    it('should build correctly', () => {
        // When
        const entity = SettingEntity.newBuilder<{ a: string }>()
            .withSettingId(1)
            .withKey(SettingKey.STAFF_LIST)
            .withValue({ a: 'gg' })
            .build();

        // Then
        expect(entity.settingId).toEqual(1);
        expect(entity.key).toEqual(SettingKey.STAFF_LIST);
        expect(entity.getParsedValue().a).toEqual('gg');
    });

    it('should build from current correctly', () => {
        // Given
        const entity = SettingEntity.newBuilder<{ a: string }>()
            .withSettingId(1)
            .withKey(SettingKey.STAFF_LIST)
            .withValue({ a: 'gg' })
            .build();
        
        // When
        const newEntity = entity.newBuilderFromCurrent()
            .build();

        // Then
        expect(entity.settingId).toEqual(1);
        expect(entity.key).toEqual(SettingKey.STAFF_LIST);
        expect(entity.getParsedValue().a).toEqual('gg');
    });
});
