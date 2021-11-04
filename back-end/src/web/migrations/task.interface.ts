export interface MigrationTask {
    run(): Promise<void>;

    getName(): string;
}
