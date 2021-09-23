export enum ServerType {
    SHOUTCAST_V1 = 'SHOUTCAST_V1',
    SHOUTCAST_V2 = 'SHOUTCAST_v2',
    ICECAST_V2 = 'ICECAST_V2'
}

export class ServerTypeLabel {
    static [ServerType.SHOUTCAST_V1] = 'Shoutcast V1';
    static [ServerType.SHOUTCAST_V2] = 'Shoutcast V2';
    static [ServerType.ICECAST_V2] = 'Icecast V2';

    static of(value: string): string {
        return ServerTypeLabel[value] || 'Unknown';
    }
}

export interface RadioSettingsClass {
    host: string;
    port: number;
    password: string;
    adminPassword: string;
    mountPoint: string;
    serverType: ServerType;
    isAzuraCast: boolean;
}
