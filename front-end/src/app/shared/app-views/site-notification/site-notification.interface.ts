export enum SiteNotificationType {
    INFO,
    WARNING,
    ERROR,
    SUCCESS
}

export interface SiteNotification {
    title: string;
    message: string;
    type: SiteNotificationType;
}
