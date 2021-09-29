import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from './created-updated-at.entity';

export interface IRoleEntity {
    id: string;
    discordId: string;
    name: string;
    permissions: number;
}

@Entity('roles')
export class RoleEntity extends CreatedUpdatedAtEntity implements IRoleEntity {
    @ObjectIdColumn()
    readonly id: string;
    @Column({ unique: true })
    readonly discordId: string;
    @Column()
    readonly name: string;
    @Column({ default: 0 })
    readonly permissions: number;

    constructor(builder: IRoleEntity) {
        super();
        if (!builder) {
            return;
        }

        this.id = builder.id;
        this.discordId = builder.discordId;
        this.name = builder.name;
        this.permissions = builder.permissions;
    }

    newBuilderFromCurrent(): Builder {
        return new Builder(this);
    }

    static newBuilder(): Builder {
        return new Builder();
    }

    static newBuilderFrom(user: IRoleEntity): Builder {
        return new Builder(user);
    }
}

class Builder {
    private myData: IRoleEntity = {
        id: undefined,
        discordId: undefined,
        name: undefined,
        permissions: 0
    };

    constructor(entity?: IRoleEntity) {
        Object.assign(this.myData, entity);
    }

    withId(id: string): Builder {
        this.myData.id = id;
        return this;
    }

    withDiscordId(discordId: string): Builder {
        this.myData.discordId = discordId;
        return this;
    }

    withName(name: string): Builder {
        this.myData.name = name;
        return this;
    }

    withPermissions(permissions: number): Builder {
        this.myData.permissions = permissions;
        return this;
    }

    build(): RoleEntity {
        return new RoleEntity(this.myData);
    }
}
