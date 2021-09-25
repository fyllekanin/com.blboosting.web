import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

export interface IUserEntity {
    id?: ObjectID;
    discordId: string;
    username: string;
}

@Entity('users')
export class UserEntity extends CreatedUpdatedAtEntity implements IUserEntity {
    @ObjectIdColumn()
    id?: ObjectID;
    @Column({ unique: true })
    discordId: string;
    @Column()
    username: string;

    constructor(builder: IUserEntity) {
        super();
        if (!builder) {
            return;
        }

        this.id = builder.id;
        this.discordId = builder.discordId;
        this.username = builder.username;
    }

    newBuilderFromCurrent(): Builder {
        return new Builder(this);
    }

    static newBuilder(): Builder {
        return new Builder();
    }
}

class Builder {
    private myData: IUserEntity = {
        id: undefined,
        discordId: undefined,
        username: undefined
    };

    constructor(entity?: UserEntity) {
        Object.assign(this.myData, entity);
    }

    withUserId(userId: ObjectID): Builder {
        this.myData.id = userId;
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

    build(): UserEntity {
        return new UserEntity(this.myData);
    }
}
