import { ObjectId } from 'mongodb';
import { CreatedUpdatedAtEntity } from '../created-updated-at.interface';

export interface IUserEntity extends CreatedUpdatedAtEntity {
    _id?: ObjectId;
    discordId: string;
    battleNetId?: number;
    username: string;
    avatarHash: string;
}
