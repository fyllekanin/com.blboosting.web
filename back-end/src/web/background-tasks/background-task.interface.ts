export interface IBackgroundTask {
    run (): Promise<void>;

    getSchedule (): string;
}
