require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const fs = require('fs');

// Create bot client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('guildMemberAdd', async (member) => {
  const log = `${new Date().toISOString()} - ${member.user.tag} (${member.user.id}) joined ${member.guild.name}\n`;

  console.log(log);
  fs.appendFileSync('user-joins.log', log, 'utf8');

  // Find or create the "discordids" channel
  let channel = member.guild.channels.cache.find(ch => ch.name === 'discordids');
  if (!channel) {
    try {
      channel = await member.guild.channels.create({
        name: 'discordids',
        type: 0, // text channel
        permissionOverwrites: [
          {
            id: member.guild.roles.everyone,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
          }
        ]
      });
      console.log(`✅ Created channel "discordids" in ${member.guild.name}`);
    } catch (err) {
      console.error(`❌ Failed to create channel:`, err);
      return;
    }
  }

  // Send join info to the channel
  if (channel) {
    channel.send(`👤 **New Member:** ${member.user.tag}\n🆔 **ID:** ${member.user.id}`);
  }
});

client.login(process.env.TOKEN);
