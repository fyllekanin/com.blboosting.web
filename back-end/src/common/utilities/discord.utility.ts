import { Client } from 'discord.js';

export class DiscordUtility {

    static getRoleIds(client: Client, discordId: string): Array<string> {
        const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
        const member = guild.members.cache.get(discordId);
        const roleIds: Array<string> = [];
        member.roles.cache.forEach(role => roleIds.push(role.id));
        return roleIds;
    }

}