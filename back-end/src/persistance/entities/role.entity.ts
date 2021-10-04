import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from './created-updated-at.entity';

export enum RolePermission {
    CAN_LOGIN = 'CAN_LOGIN',
    CAN_CREATE_BOOST = 'CAN_CREATE_BOOST',
    CAN_MANAGE_ROLES = 'CAN_MANAGE_ROLES'
}

export interface IRolePermissions {
    CAN_LOGIN: boolean;
    CAN_CREATE_BOOST: boolean;
    CAN_MANAGE_ROLES: boolean;
}

export interface IRoleEntity {
    id: string;
    discordId: string;
    name: string;
    position: number;
    permissions: RolePermissions;
}

export class RolePermissions implements IRolePermissions {
    @Column()
    @Index()
    CAN_LOGIN: boolean;
    @Column()
    @Index()
    CAN_CREATE_BOOST: boolean;
    @Column()
    @Index()
    CAN_MANAGE_ROLES: boolean;

    constructor(builder?: IRolePermissions) {
        if (!builder) {
            return;
        }
        this.CAN_LOGIN = builder.CAN_LOGIN;
        this.CAN_CREATE_BOOST = builder.CAN_CREATE_BOOST;
        this.CAN_MANAGE_ROLES = builder.CAN_MANAGE_ROLES;
    }


    newBuilderFromCurrent(): RolePermissionsBuilder {
        return new RolePermissionsBuilder(this);
    }

    static newBuilder(): RolePermissionsBuilder {
        return new RolePermissionsBuilder();
    }

    static newBuilderFrom(permissions: IRolePermissions): RolePermissionsBuilder {
        return new RolePermissionsBuilder(permissions);
    }
}

class RolePermissionsBuilder {
    private myData: IRolePermissions = {
        CAN_LOGIN: false,
        CAN_CREATE_BOOST: false,
        CAN_MANAGE_ROLES: false
    };

    constructor(entity?: IRolePermissions) {
        Object.assign(this.myData, entity);
    }

    withCanLogin(canLogin: boolean): RolePermissionsBuilder {
        this.myData.CAN_LOGIN = canLogin;
        return this;
    }

    canCreateBoost(canCreateBoost: boolean): RolePermissionsBuilder {
        this.myData.CAN_CREATE_BOOST = canCreateBoost;
        return this;
    }

    withCanManageGroups(canManageGroups: boolean): RolePermissionsBuilder {
        this.myData.CAN_MANAGE_ROLES = canManageGroups;
        return this;
    }

    build(): RolePermissions {
        return new RolePermissions(this.myData);
    }
}

@Entity('roles')
export class RoleEntity extends CreatedUpdatedAtEntity implements IRoleEntity {
    @ObjectIdColumn()
    readonly id: string;
    @Column({unique: true})
    @Index()
    readonly discordId: string;
    @Column()
    readonly name: string;
    @Column(_type => RolePermissions)
    readonly permissions: RolePermissions;
    @Column()
    readonly position: number;

    constructor(builder: IRoleEntity) {
        super();
        if (!builder) {
            return;
        }

        this.id = builder.id;
        this.discordId = builder.discordId;
        this.name = builder.name;
        this.permissions = builder.permissions;
        this.position = builder.position;
    }

    newBuilderFromCurrent(): RoleBuilder {
        return new RoleBuilder(this);
    }

    static newBuilder(): RoleBuilder {
        return new RoleBuilder();
    }

    static newBuilderFrom(user: IRoleEntity): RoleBuilder {
        return new RoleBuilder(user);
    }
}

class RoleBuilder {
    private myData: IRoleEntity = {
        id: undefined,
        discordId: undefined,
        name: undefined,
        permissions: RolePermissions.newBuilder().build(),
        position: undefined
    };

    constructor(entity?: IRoleEntity) {
        Object.assign(this.myData, entity);
    }

    withId(id: string): RoleBuilder {
        this.myData.id = id;
        return this;
    }

    withDiscordId(discordId: string): RoleBuilder {
        this.myData.discordId = discordId;
        return this;
    }

    withName(name: string): RoleBuilder {
        this.myData.name = name;
        return this;
    }

    withPermissions(permissions: RolePermissions): RoleBuilder {
        this.myData.permissions = permissions;
        return this;
    }

    withPosition(position: number): RoleBuilder {
        this.myData.position = position;
        return this;
    }

    build(): RoleEntity {
        return new RoleEntity(this.myData);
    }
}
