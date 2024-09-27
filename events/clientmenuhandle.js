require('dotenv').config()
const { 
    BanPlayer,
    UnbanPlayer,
    GetBannedPlayers,
    GetBannedPlayer

} = require('../db/mongoquerys');

const {
    convertTime,
    teamName,
    time,
} = require('../lang/inGame')


//const { showMenu, printChat, consolePrint, serverCommand } = require('../events/events')
const path = require('path');
const Flags = require('../settings/flags')

class ClientMenuHandle {
    /**
     * Method to handle the ClientMenuHandle event
     * @param {string} Event - Event name (menu callback name).
     * @param {Object} Server - Server information.
     * @param {Object} Player - Player information.
     * @param {Object} Item - Item object containing menu item details.
     * @param {string} Item.Info - Info string passed to the menu item.
     * @param {string} Item.Text - Text of the option string passed to the menu item.
     * @param {boolean} Item.Disabled - Whether this option is disabled or not.
     * @param {string} Item.Extra - Extra info string passed to the menu item.
     * @returns {Object|null} LogAPI commands for the server or null.
     */

    async generateResponse(Event, Server, Player, Item) {

        const admin = Player;

        const players = Server.Players;

        const adminFlags = new Flags(path.join(__dirname, '../settings/flags.json'));

        let result = {};

        let obj = {}

        //console.log(Item.Extra);
        //
        if (Item.Extra == "kmenu" ||
            Item.Extra == "bmenu" ||
            Item.Extra == "ubmenu"||
            Item.Extra == "tmenu" ||
            Item.Extra == "mmenu" ||
            Item.Extra == "smenu" ||
            Item.Extra == "rmenu" ||
            Item.Info == "Map;" ||
            Item.Extra == "lmenu") {
            obj = {}
        } else {
            //Test with 1+ clients at same time?
            //Simplified version of items converted to an obj
            obj = {
                steamid: Item.Extra.split(';')[3],
                name: Item.Extra.split(';')[4],
                ip: Item.Extra.split(';')[2].split(':')[0], //IP without port
                adminsteamid: admin.Auth,
                ban_reason: Item.Extra.split(';')[5], //When choosing the 
                ban_length: convertTime[Item.Extra.split(';')[6]] || 0,
                adminnick: admin.Name,
                serverip: Server.Address, // should we pass also hostname?
                adminEntity: admin.EntityId,// this is actually an integer
                EntityId: parseInt(Item.Extra.split(';')[1]),
                UserId: parseInt(Item.Extra.split(';')[0]),
                serverName: Server.Hostname,
            };

        }
        switch (Item.Info) {

            case "KickMenu":
                
                if (!adminFlags.hasPermission(admin.Auth, 'kick')) {
                    result = adminFlags.PrintNoAccess(admin)

                    return result;
                }

                result["ShowMenu"] = {
                    Title: `^r${process.env.APP_TAG_PREFIX || "[WebAdmin]"}\n^yKick Menu`,
                    Callback: "ClientMenuHandle",
                    Exit: true,
                    EntityId: admin.EntityId,
                    Items: await this.generateMenuItems(Server, "kick")
                };

                break;

            case `kick;${obj.UserId}`:

                if (Item.Disabled) {
                    const msg = `^4* ^1Player ^3${Item.Text.replace(/\\r|\\w|\*/g, '').trim()}^1 has immunity.`

                    result["ShowMenu"] = {
                        Title: `^r${process.env.APP_TAG_PREFIX || "[WebAdmin]"}\n^yKick Menu`,
                        Callback: "ClientMenuHandle",
                        Exit: true,
                        EntityId: admin.EntityId,
                        Items: await this.generateMenuItems(Server, "kick")
                    };

                    result["PrintChat"] = {
                        EntityId: admin.EntityId,
                        Message: msg
                    };
                    return result;
                }
                const cmd = `kick #${obj.UserId}`
                const msg = `^4* ^1ADMIN ^4${admin.Name}^1: kicked player ^3${obj.name}^1.`

                result['ServerCommand'] = cmd;
                result["PrintChat"] = {
                    EntityId: 0,
                    Message: msg
                };

                break;
                
            case "BanMenu":

                if (!adminFlags.hasPermission(admin.Auth, 'ban')) {

                    result = adminFlags.PrintNoAccess(admin)

                    return result;
                }
                result["ShowMenu"] = {
                    Title: `^r${process.env.APP_TAG_PREFIX || "[WebAdmin]"}\n^yBan Menu`,
                    Callback: "ClientMenuHandle",
                    Exit: true,
                    EntityId: admin.EntityId,
                    Items: await this.generateMenuItems(Server, "ban")
                };

                break;

            case `ban;${obj.UserId}`:

                if (Item.Disabled) {

                    const msg = `^4* ^1Player ^3${Item.Text.replace(/\\r|\\w|\*/g, '').trim()}^1 has immunity.`;
                    result["ShowMenu"] = {
                        Title: `^r${process.env.APP_TAG_PREFIX || "[WebAdmin]"}\n^yBan Menu`,
                        Callback: "ClientMenuHandle",
                        Exit: true,
                        EntityId: admin.EntityId,
                        Items: await this.generateMenuItems(Server, "ban")
                    };

                    result["PrintChat"] = {
                        EntityId: admin.EntityId,
                        Message: msg
                    };
                    return result;

                }
                result["ShowMenu"] = {
                    Title: `^r${process.env.APP_TAG_PREFIX || "[WebAdmin]"}\n^yBan Reasons\n^r${obj.name}`,
                    Callback: "ClientMenuHandle",
                    Exit: true,
                    EntityId: admin.EntityId,
                    Items: await this.generateReasonItems(Item.Extra)
                };
                //console.log(result["ShowMenu"].Items);

                break;

            case `Reason;${obj.UserId}`:

                result["ShowMenu"] = {
                    Title: `^r${process.env.APP_TAG_PREFIX || "[WebAdmin]"}\n^yBan Time\n^r${obj.name}`,
                    Callback: "ClientMenuHandle",
                    Exit: true,
                    EntityId: admin.EntityId,
                    Items: await this.generateTimeItems(Item.Extra)
                };
                //console.log(result["ShowMenu"].Items);

                break;

            case `Time;${obj.UserId}`:

                const cnslmsg = `${process.env.APP_TAG_PREFIX || "[WebAdmin]"}\nName: ${obj.name}\nSteamID: ${obj.steamid}\nIP: ${obj.ip}\nReason: ${obj.ban_reason}`;
                const kickcmd = `kick #${obj.UserId} You have been banned from this server. Check details in console.`
                const banmsg = `^4* ^1ADMIN ^4${admin.Name}^1: banned ^3${obj.name}^1 for ^3(${obj.ban_reason})-(${Item.Text})^1.`
                const prevban = `^4* ^1Something went wrong when try to ban.`
                
                try {

                    const dbTest = await BanPlayer(obj)

                    if (dbTest) {
                        result["ClientPrint"] = {
                            EntityId: obj.EntityId,
                            PrintType: 2,
                            Message: cnslmsg
                        };
                        result['ServerCommand'] = kickcmd;
                        result["PrintChat"] = {
                            EntityId: 0,
                            Message: banmsg
                        };
                    }
                    else {//Caso en el cual nose puede realizar el baneo
                        //result['ServerCommand'] = kickcmd;
                        result["PrintChat"] = {
                            EntityId: admin.EntityId,
                            Message: prevban
                        };
                    }
                } catch (error) {
                    console.log(error);
                    
                    result["PrintChat"] = {
                        EntityId: admin.EntityId,
                        Message: prevban
                    };
                }
                break;

            case "UnbanMenu":

                if (!adminFlags.hasPermission(admin.Auth, 'unban')) {

                    result = adminFlags.PrintNoAccess(admin)

                    return result;
                }
                result["ShowMenu"] = {
                    Title: `^r${process.env.APP_TAG_PREFIX || "[WebAdmin]"}\n^yUnban Menu`,
                    Callback: "ClientMenuHandle",
                    Exit: true,
                    EntityId: admin.EntityId,
                    Items: await this.generateBanList()
                };

                break;

            case `unban;`:

                const player = await this.GetBannedPlayer(Item.Extra.split(';')[1])

                result["ShowMenu"] = {
                    Title: `^r${process.env.APP_TAG_PREFIX || "[WebAdmin]"}\n^yUnban Player ^r${player.steamID}\n^yNick ^r${player.nick}`,
                    Callback: "ClientMenuHandle",
                    Exit: true,
                    EntityId: admin.EntityId,
                    Items: await this.generateConfirmUnban(player)
                };
                //console.log(result["ShowMenu"].Items);

                break;
            case `unbanConf;`:

                const unbanPlayer = await UnbanPlayer(Item.Extra.split(';')[0]);
                const unbanMsg = `^4* ^1ADMIN ^4${admin.Name}^1: unbanned ^3${Item.Extra.split(';')[1]}^1 with steamid ^3${Item.Extra.split(';')[0]}^1.`
                if (!unbanPlayer) {
                    console.log(`Some error unbaning the player`);
                }else{
                    result["PrintChat"] = {
                        EntityId: 0,
                        Message: unbanMsg
                    };
                }

                //console.log(result["ShowMenu"].Items);

                break;

            case "TeamMenu":

                if (!adminFlags.hasPermission(admin.Auth, 'team')) {
                    result = adminFlags.PrintNoAccess(admin)
                    return result;
                }

                result["ShowMenu"] = {
                    Title: `^r${process.env.APP_TAG_PREFIX || "[WebAdmin]"}\n^yTeam Menu`,
                    Callback: "ClientMenuHandle",
                    Exit: true,
                    EntityId: admin.EntityId,
                    Items: await this.generateMenuItems(Server, "team")
                };

                break;

            case `team;${obj.UserId}`:

                if (Item.Disabled) {

                    const msg = `^4* ^1Player ^3${Item.Text.replace(/\\r|\\w|\*/g, '').trim()}^1 has immunity.`

                    result["ShowMenu"] = {
                        Title: `^r${process.env.APP_TAG_PREFIX || "[WebAdmin]"}\n^yTeam Menu`,
                        Callback: "ClientMenuHandle",
                        Exit: true,
                        EntityId: admin.EntityId,
                        Items: await this.generateMenuItems(Server, "team")
                    };

                    result["PrintChat"] = {
                        EntityId: admin.EntityId,
                        Message: msg
                    };
                    return result;
                }
                result["ShowMenu"] = {
                    Title: `^r${process.env.APP_TAG_PREFIX || "[WebAdmin]"}\n^yTeam Menu\n^r${obj.name}`,
                    Callback: "ClientMenuHandle",
                    Exit: true,
                    EntityId: admin.EntityId,
                    Items: await this.generateTeamsItems(players, Item.Extra)
                };

                break;

            case `TeamC;${obj.UserId}`:

                if (obj.ban_reason == players[obj.steamid].Team) {
                    const msg = `^4* ^1Can't swap ^3${obj.name}^1 to same team.`

                    result["ShowMenu"] = {
                        Title: `^r${process.env.APP_TAG_PREFIX || "[WebAdmin]"}\n^yTeam Menu\n^r${obj.name}`,
                        Callback: "ClientMenuHandle",
                        Exit: true,
                        EntityId: admin.EntityId,
                        Items: await this.generateTeamsItems(players, Item.Extra)
                    }
                    result["PrintChat"] = {
                        EntityId: Player.EntityId,
                        Message: msg
                    };
                    return result;
                }
                msg = `^4* ^1ADMIN ^4${admin.Name}^1: transfer ^4${obj.name}^1 to ^3${Item.Text}^1.`
                result["ChangeTeam"] = {
                    //Change UserId for EntityId on LogApi event.
                    UserId: obj.EntityId,
                    iTeam: Number(obj.ban_reason)
                };
                result["PrintChat"] = {
                    EntityId: 0,
                    Message: msg
                };
                break;
            case "SlayMenu":
                if (!adminFlags.hasPermission(admin.Auth, 'slay')) {
                    result = adminFlags.PrintNoAccess(admin)

                    return result;
                }
                  
                result["ShowMenu"] = {
                    Title: `^r${process.env.APP_TAG_PREFIX || "[WebAdmin]"}\n^ySlay Menu`,
                    Callback: "ClientMenuHandle",
                    Exit: true,
                    EntityId: admin.EntityId,
                    Items: await this.generateSlayItems(Server, "slay")
                };
                
                break;

            case `slay;${obj.UserId}`:

                if (Item.Disabled) {
                    const msg = `^4* ^1Player ^3${Item.Text.replace(/\\r|\\w|\*/g, '').trim()}^1 has immunity.`

                    result["ShowMenu"] = {
                        Title: `^r${process.env.APP_TAG_PREFIX || "[WebAdmin]"}\n^ySlay Menu`,
                        Callback: "ClientMenuHandle",
                        Exit: true,
                        EntityId: admin.EntityId,
                        Items: await this.generateSlayItems(Server, "slay")
                    };

                    result["PrintChat"] = {
                        EntityId: admin.EntityId,
                        Message: msg
                    };
                    return result;
                }

                const msg1 = `^4* ^1ADMIN ^3${admin.Name}^1: slay ^4${obj.name}^1.`

                result["KillPlayer"] = {
                    UserId: obj.EntityId
                };
                result["PrintChat"] = {
                    EntityId: 0,
                    Message: msg1
                };

                break;
            case "MapMenu":
                
                if (!adminFlags.hasPermission(admin.Auth, 'map')) {
                    result = adminFlags.PrintNoAccess(admin)

                    return result;
                }

                result["ShowMenu"] = {
                    Title: `^r${process.env.APP_TAG_PREFIX || "[WebAdmin]"}\n^yMap Menu`,
                    Callback: "ClientMenuHandle",
                    Exit: true,
                    EntityId: admin.EntityId,
                    Items: await this.generateMapsItems()
                };

                break;

            case `Map;`:

                const msgmap = `^4* ^1ADMIN ^4${admin.Name}^1: changed map to ^3${Item.Extra}^1.`

                result["PrintChat"] = {
                    EntityId: 0,
                    Message: msgmap
                };
                result["ChangeMap"] = {
                    MapName: Item.Extra
                };
               
                break;

            default:
                return null
        }
        return result;
    }

    async generateSlayItems(Server, flag) {
        const adminFlags = new Flags(path.join(__dirname, '../settings/flags.json'));
        const items = [];
        const players = Server.Players;
        console.log(players);

        let index = 1;

        for (const playerKey in players) {
            if (players.hasOwnProperty(playerKey)) {

                const player = players[playerKey];
                console.log(player);
                // Get neccesarry properties
                const { Name, Auth, UserId, EntityId, Address, isAlive } = player;

                let v1 = false;

                if (!isAlive || adminFlags.hasPermission(Auth, 'immunity')) v1 = true;

                // Create Object item and push it into the array
                items.push({
                    Info: `${flag};${UserId}`,
                    Text: adminFlags.hasPermission(Auth, 'immunity') ? `${Name}\\r *\\w` : `${Name}`,
                    Disabled: v1,
                    Extra: `${UserId};${EntityId};${Address};${Auth};${Name.replace(/;/g, "")}`
                });

                index++;
            }
        }

        return items;

    }
    async generateMenuItems(Server, flag) {
        const adminFlags = new Flags(path.join(__dirname, '../settings/flags.json'));
        const items = [];
        const players = Server.Players;
        console.log(players);

        let index = 1;

        for (const playerKey in players) {
            if (players.hasOwnProperty(playerKey)) {

                const player = players[playerKey];

                // Get neccesarry properties
                const { Name, Auth, UserId, EntityId, Address, isAlive } = player;

                // Create Object item and push it into the array
                items.push({
                    Info: `${flag};${UserId}`,
                    Text: adminFlags.hasPermission(Auth, 'immunity') ? `${Name}\\r *\\w` : `${Name}`,
                    Disabled: adminFlags.hasPermission(Auth, 'immunity'),
                    Extra: `${UserId};${EntityId};${Address};${Auth};${Name.replace(/;/g, "")}`
                });

                index++;
            }
        }

        //console.log(items);

        return items;

    }
    async generateReasonItems(Extra) {
        const items = []
        let reasons = ['Cheating / No Scan', 'Insulting', 'Trolling', 'Spamming', 'Harrasing'];
        for (let i = 1; i <= reasons.length; i++) {

            items.push({
                Info: `Reason;${Extra.split(';')[0]}`,
                Text: `${reasons[i - 1]}`,
                Disabled: false,
                Extra: `${Extra};${reasons[i - 1]}`
            });
        }

        //console.log(items);

        return items;
    }
    async generateTeamsItems(Players, Extra) {
        const items = []

        let teams = {
            TT: 1,
            CT: 2,
            SPEC: 3
        };

        if (Players[Extra.split(';')[3]].Team != teams.TT) {
            items.push({
                Info: `TeamC;${Extra.split(';')[0]}`,
                Text: teamName.TT,
                Disabled: false,
                Extra: `${Extra};${teams.TT}`
            });
        }

        if (Players[Extra.split(';')[3]].Team != teams.CT) {
            items.push({
                Info: `TeamC;${Extra.split(';')[0]}`,
                Text: teamName.CT,
                Disabled: false,
                Extra: `${Extra};${teams.CT}`
            });
        }

        if (Players[Extra.split(';')[3]].Team != teams.SPEC) {
            items.push({
                Info: `TeamC;${Extra.split(';')[0]}`,
                Text: teamName.SPEC,
                Disabled: false,
                Extra: `${Extra};${teams.SPEC}`
            });
        }

        //console.log(items);

        return items;
    }

    async generateTimeItems(Extra) {
        const items = []

        for (let i = 1; i <= time.length; i++) {

            items.push({
                Info: `Time;${Extra.split(';')[0]}`,
                Text: `${time[i - 1]}`,
                Disabled: false,
                Extra: `${Extra};${time[i - 1]}`
            });
        }

        //console.log(items);

        return items;
    }
    
    async generateMapsItems() {
        const items = []
        const fs = require('fs');

        const data = fs.readFileSync(path.join(__dirname, '../settings/maps.ini'), 'utf-8');
      
        const lineas = data.split('\n');
       
        for (let i = 1; i <= lineas.length; i++) {

            items.push({
                Info: `Map;`,
                Text: `${lineas[i - 1]}`,
                Disabled: false,
                Extra: `${lineas[i - 1]}`
            });
        }

        //console.log(items);

        return items;
    }
    async generateBanList() {
        const items = [];
        const players = await GetBannedPlayers();
        console.log(players);
 
        for (const playerKey in players) {
            if (players.hasOwnProperty(playerKey)) {

                const player = players[playerKey];

                // Get neccesarry properties
                const { steamID, nick } = player;

                // Create Object item and push it into the array
                items.push({
                    Info: `unban;`,
                    Text: `${nick} ${steamID}`,
                    Disabled: false,
                    Extra: `unban;${steamID}`
                });

            }
        }

        //console.log(items);

        return items;

    }

    async generateConfirmUnban(player) {

        const items = []

        items.push({
            Info: `unbanConf;`,
            Text: `Yes`,
            Disabled: false,
            Extra: `${player.SteamID};${player.nick}`
        });
        items.push({
            Info: `unbanDen;`,
            Text: `No`,
            Disabled: false,
            Extra: `${player.SteamID};${player.nick}`
        });
       
        //console.log(items);

        return items;
    }

}
module.exports = ClientMenuHandle;