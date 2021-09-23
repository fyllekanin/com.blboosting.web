import { Column, Entity, Index, ObjectID, ObjectIdColumn } from 'typeorm';
import { LogTypes } from '../../../logging/log.types';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

export interface ILogEntity {
    id: ObjectID;
    logId: LogTypes;
    contentId: number;
    userId: number;
    beforeChange: string;
    afterChange: string;
    ip: string;
}

@Entity('log')
export class LogEntity extends CreatedUpdatedAtEntity implements ILogEntity {
    @ObjectIdColumn()
    id: ObjectID;
    @Column()
    @Index()
    logId: number;
    @Column()
    @Index()
    contentId: number;
    @Column()
    @Index()
    userId: number;
    @Column({ nullable: true, type: 'longtext' })
    beforeChange: string;
    @Column({ nullable: true, type: 'longtext' })
    afterChange: string;
    @Column()
    @Index()
    ip: string;

    constructor(builder: ILogEntity) {
        super();
        if (!builder) {
            return;
        }

        this.logId = builder.logId;
        this.id = builder.id;
        this.contentId = builder.contentId;
        this.userId = builder.userId;
        this.beforeChange = builder.beforeChange;
        this.afterChange = builder.afterChange;
        this.ip = builder.ip;
    }

    static newBuilder(): LogBuilder {
        return new LogBuilder();
    }
}

export class LogBuilder {
    protected myData: ILogEntity = {
        id: undefined,
        logId: undefined,
        contentId: undefined,
        userId: undefined,
        beforeChange: undefined,
        afterChange: undefined,
        ip: undefined
    };

    constructor(entity?: LogEntity) {
        Object.assign(this.myData, entity);
    }

    withId(id: ObjectID): LogBuilder {
        this.myData.id = id;
        return this;
    }

    withLogId(logId: number): LogBuilder {
        this.myData.logId = logId;
        return this;
    }

    withContentId(contentId: number): LogBuilder {
        this.myData.contentId = contentId;
        return this;
    }

    withUserId(userId: number): LogBuilder {
        this.myData.userId = userId;
        return this;
    }

    withBeforeChange(beforeChange: string): LogBuilder {
        this.myData.beforeChange = beforeChange;
        return this;
    }

    withAfterChange(afterChange: string): LogBuilder {
        this.myData.afterChange = afterChange;
        return this;
    }

    withIp(ip: string): LogBuilder {
        this.myData.ip = ip;
        return this;
    }

    build(): LogEntity {
        return new LogEntity(this.myData);
    }
}
