import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

export interface IUserEntity {
    id: string;
    discordId: string;
    username: string;
    avatarHash: string;
}

@Entity('users')
export class UserEntity extends CreatedUpdatedAtEntity implements IUserEntity {
    @ObjectIdColumn()
    id: string;
    @Column({ unique: true })
    discordId: string;
    @Column()
    username: string;
    @Column()
    avatarHash: string;

    constructor(builder: IUserEntity) {
        super();
        if (!builder) {
            return;
        }

        this.id = builder.id;
        this.discordId = builder.discordId;
        this.username = builder.username;
        this.avatarHash = builder.avatarHash;
    }

    newBuilderFromCurrent(): Builder {
        return new Builder(this);
    }

    static newBuilder(): Builder {
        return new Builder();
    }

    static newBuilderFrom(user: IUserEntity): Builder {
        return new Builder(user);
    }
}

class Builder {
    private myData: IUserEntity = {
        id: undefined,
        discordId: undefined,
        username: undefined,
        avatarHash: undefined
    };

    constructor(entity?: IUserEntity) {
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

    withUsername(username: string): Builder {
        this.myData.username = username;
        return this;
    }

    withAvatarHash(avatarHash: string): Builder {
        this.myData.avatarHash = avatarHash;
        return this;
    }

    build(): UserEntity {
        return new UserEntity(this.myData);
    }
}
