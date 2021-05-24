module.exports.load = async function(app, db) {
    const fetch = require('node-fetch');
const { PREFIX, ACTIVITY } = require('./config.json')
const discord = require('discord.js')
const client = new discord.Client()
const settings = require("./settings.json");

client.on("ready", async () => {
    client.user.setActivity(ACTIVITY);
    console.log(`[ DISCORD.JS ] Ready on client ${client.user.tag}`)
})

client.on("message", async (message, req) => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
  
    const args = message.content
      .slice(prefix.length)
      .trim()
      .split(" ");
    const command = args.shift().toLowerCase();
    // the rest of your code
  
    if (command == "create") {

          if (!args[0]) {
            return error("ERR: Invalid Command Arguments", `Use: \`${PREFIX}create < server Name > < egg / server type > < ram > < disk > < cpu > < location >\``, message);
          }

    let name = decodeURIComponent(message.query.name);
        if (name.length < 1) return error(
                                        "ERR: LITTLE SERVER NAME",
                                         "Your Sever Name min 1 character.", 
                                         message
                                         );
        if (name.length > 191) return error(
                                             "ERR: BIG SERVER NAME", 
                                            "Server name must less than **191 Character**.", message);
  
        let location = message.query.location;

        if (Object.entries(newsettings.api.client.locations).filter(vname => vname[0] == location).length !== 1) return error(
            "ERR: Invalid Location",
            "**Available Locations (free for all):\n\n\`node1: singapore\`\n\n**Premium Locations:**\n\n\`-\`",
            message
        );

        let requiredpackage = Object.entries(newsettings.api.client.locations).filter(vname => vname[0] == location)[0][1].package;
        if (requiredpackage) if (!requiredpackage.includes(packagename ? packagename : newsettings.api.client.packages.default)) return error("ERR: Premium Location",
        "**Available Locations (free for all):\n\n\`node1: singapore\`\n\n**Premium Locations:**\n\n\`-\`",
        message);


        let egg = message.query.egg;
  
        let egginfo = newsettings.api.client.eggs[egg];
        if (!newsettings.api.client.eggs[egg]) return error("ERR: Invalid EGG / Server Type", `All EGG / Server Type List available in <#${eggChannelID}>`, message);
        let ram = parseFloat(req.query.ram);
        let disk = parseFloat(req.query.disk);
        let cpu = parseFloat(req.query.cpu);
        if (!isNaN(ram) && !isNaN(disk) && !isNaN(cpu)) {
          if (ram2 + ram > package.ram + extra.ram) return error(`ERR: EXCEED RAM`, "The server could not be created because you have requested to create a server that exceeds your plan.", message);
          if (disk2 + disk > package.disk + extra.disk) return error(`ERR: EXCEED DISK`, "The server could not be created because you have requested to create a server that exceeds your plan.", message);
          if (cpu2 + cpu > package.cpu + extra.cpu) return error(`ERR: EXCEED CPU`, "The server could not be created because you have requested to create a server that exceeds your plan.", message);
          if (egginfo.minimum.ram) if (ram < egginfo.minimum.ram) return error("ERR: TOO LITTLE RAM", `The minimum RAM to create your server with type egg: **${egg}** is **${egginfo.minimum.ram}MB**`, message);
          if (egginfo.minimum.disk) if (disk < egginfo.minimum.disk) return error("ERR: TOO LITTLE DISK", `The minimum DISK to create your server with type egg: **${egg}** is **${egginfo.minimum.disk}MB**`, message);
          if (egginfo.minimum.cpu) if (cpu < egginfo.minimum.cpu) return error("ERR: TOO LITTLE CPU", `The minimum CPU to create your server with type egg: **${egg}** is **${egginfo.minimum.cpu}%**`, message);
          if (egginfo.maximum) {
            if (egginfo.maximum.ram) if (ram > egginfo.maximum.ram) return error("ERR: TOO MUCH RAM", `The maximum RAM to create your server with type egg: **${egg}** is **${egginfo.maximum.ram}MB**`, message);
            if (egginfo.maximum.disk) if (disk > egginfo.maximum.disk) return error("ERR: TOO MUCH DISK", `The maximum DISK to create your server with type egg: **${egg}** is **${egginfo.maximum.disk}MB**`, message);
            if (egginfo.maximum.cpu) if (cpu > egginfo.maximum.cpu) return error("ERR: TOO MUCH CPU", `The maximum RAM to create your server with type egg: **${egg}** is **${egginfo.maximum.cpu}%**`, message);
          }
  
          let specs = egginfo.info;
          specs["user"] = (await db.get("users-" + req.session.userinfo.id));
          if (!specs["limits"]) specs["limits"] = {
            swap: 0,
            io: 500,
            backups: 1
          };
          specs.name = name;
          specs.limits.memory = ram;
          specs.limits.disk = disk;
          specs.limits.cpu = cpu;
          if (!specs["deploy"]) specs.deploy = {
            locations: [],
            dedicated_ip: false,
            port_range: []
          }
          specs.deploy.locations = [location];
  
          let serverinfo = await fetch(
            settings.pterodactyl.domain + "/api/application/servers",
            {
              method: "post",
              headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}`, "Accept": "application/json" },
              body: JSON.stringify(await specs)
            }
          );
          if (await serverinfo.statusText !== "Created") {
            console.log(await serverinfo.text());
            return error("ERR: ERROR ON CREATE", "There has been an error while attempting to create your server. Please alert an administrator to fix this problem.", message);
          }

        }
    }

})

client.login(settings.bot.token);


function error(title, content, message, color, footer) {
  if (!color) color = "RED";
  if (!footer) footer = `${settings.guild.name}`

  return message.channel.send({
    embed: { title: title, description: content, color: color, footer: footer, addTimestamp }
  });
}

}
