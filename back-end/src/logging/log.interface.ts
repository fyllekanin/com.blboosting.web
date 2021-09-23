import { LogTypes } from './log.types';

export interface Log {
    id: LogTypes;
    contentId: number;
    userId: number;
    beforeChange: string;
    afterChange: string;
}
