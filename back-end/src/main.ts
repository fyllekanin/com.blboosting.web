import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Server } from '@overnightjs/core';
import { PageController } from './rest-services/page.controller';
import { BackgroundTaskHandler } from './background-tasks/background-task.handler';
import { INITIAL_MIDDLEWARE } from './rest-services/middlewares/initial.middleware';
import * as express from 'express';
import compression from 'compression';
import { DatabaseConfig } from './database.config';
import * as dotenv from 'dotenv';
import { Client, Intents } from 'discord.js';
import { AuthenticationController } from './rest-services/authentication.controller';
import { AdminPageController } from './rest-services/admin/admin-page.controller';
import { DiscordListener } from './discord.listener';
import { PermissionMiddleware } from './rest-services/middlewares/permission.middleware';

dotenv.config();

class MainServer extends Server {
    private readonly client: Client;
    private discordListener: DiscordListener;
    private backgroundTaskHandler: BackgroundTaskHandler;

    constructor() {
        super();
        this.backgroundTaskHandler = new BackgroundTaskHandler();
        this.app.use(express.json());
        this.app.use(compression());
        this.app.use('/', express.static(__dirname + '/public'));
        this.app.use('/resources', express.static(__dirname + '/resources'));
        this.client = new Client({
            intents: new Intents(Number(process.env.DISCORD_INTENTS))
        });
    }

    async start(port: number): Promise<void> {
        await this.preSetup();
        this.setupControllers();
        this.backgroundTaskHandler.activate();
        this.app.get('/*', (req, res) => {
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
        await createConnection(DatabaseConfig.getConfig());

        console.log('Starting discord listener');
        this.discordListener = new DiscordListener();
        await this.discordListener.start(this.client);

        console.log('Assign client to permission middleware');
        PermissionMiddleware.client = this.client;
    }

    private setupControllers(): void {
        super.addControllers(
            [
                new PageController(),
                new AuthenticationController(this.client),
                new AdminPageController()
            ],
            null,
            INITIAL_MIDDLEWARE
        );
    }
}

(async () => {
    const server = new MainServer();
    await server.start(Number(process.env.APPLICATION_PORT));
})();
