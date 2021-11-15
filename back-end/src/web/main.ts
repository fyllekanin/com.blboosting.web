import 'reflect-metadata';
import { Server } from '@overnightjs/core';
import { PageController } from './rest-services/page.controller';
import { INITIAL_MIDDLEWARE } from './rest-services/middlewares/initial.middleware';
import * as express from 'express';
import { NextFunction, Response } from 'express';
import compression from 'compression';
import { DatabaseService } from '../common/database.service';
import * as dotenv from 'dotenv';
import { Client, Intents } from 'discord.js';
import { AuthenticationController } from './rest-services/authentication.controller';
import { AdminPageController } from './rest-services/admin/admin-page.controller';
import { DiscordListener } from './discord.listener';
import { RolesController } from './rest-services/admin/roles.controller';
import { InternalRequest } from '../common/utilities/internal.request';
import { MigrationService } from './migrations/migration.service';
import { BoostsController } from './rest-services/admin/boosts.controller';
import { Configuration } from '../common/configuration';
import { BattleNetController } from './rest-services/battle-net.controller';
import cookieParser from 'cookie-parser';
import { BackgroundTaskHandler } from './background-tasks/background-task.handler';
import { BoostersController } from './rest-services/admin/boosters.controller';

dotenv.config();

class Main extends Server {
    private readonly client: Client;
    private backgroundTaskHandler: BackgroundTaskHandler;
    private discordListener: DiscordListener;

    constructor() {
        super();
        this.backgroundTaskHandler = new BackgroundTaskHandler();
        Configuration.loadConfig(process.env.ENVIRONMENT);
        this.app.use(express.json());
        this.app.use(compression());
        this.app.use(cookieParser());
        this.app.use('/', express.static(__dirname + '/public'));
        this.app.use('/resources', express.static(__dirname + '/resources'));
        this.client = new Client({
            intents: new Intents(Number(process.env.DISCORD_INTENTS))
        });
    }

    async start(port: number): Promise<void> {
        await this.preSetup();
        this.backgroundTaskHandler.activate();
        this.setupControllers();
        this.app.use('/*', (req, res) => {
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            res.sendFile(__dirname + '/public/index.html');
        });
        this.app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    }

    private async preSetup(): Promise<void> {
        console.log('Login to discord');
        await this.client.login(process.env.DISCORD_TOKEN).catch(err => {
            throw new Error('Could not connect to discord, reason:' + err);
        });

        console.log('Create database connection');
        await DatabaseService.startup();

        console.log('Run migrations');
        await MigrationService.run();

        console.log('Starting discord listener');
        this.discordListener = new DiscordListener();
        await this.discordListener.start(this.client);
    }

    private setupControllers(): void {
        super.addControllers(
            [
                new PageController(),
                new BoostersController(),
                new AuthenticationController(),
                new AdminPageController(),
                new RolesController(),
                new BoostsController(),
                new BattleNetController()
            ],
            null,
            (req: InternalRequest, res: Response, next: NextFunction) => {
                req.client = this.client;
                INITIAL_MIDDLEWARE(req, res, next);
            },
        );
    }
}

(async () => {
    const main = new Main();
    await main.start(Number(process.env.APPLICATION_PORT));
})();
