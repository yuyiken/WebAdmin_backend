const path = require('path');
const {

    mainMenuTitle,
    mainMenuKickName,
    mainMenuBanName,
    mainMenuUnbanName,
    mainMenuSlayName,
    mainMenuTeamName,
    mainMenuMapName

} = require('../lang/inGame');

//const { showMenu, printChat, showHudMsg } = require('../events/events')
const Flags = require('../settings/flags')

class ClientSay {
    /**
     * Generate JSON response based on a specific event.
     * @param {Object} Server - Server information.
     * @param {Object} Player - Player information.
     * @param {string} Type - Type (say or say_team).
     * @param {string} Message - Message sent.
     * @returns {Object|null} - The generated JSON object or null if no action is taken.
     */

    async generateResponse(Server, Player, Type, Message) {
        const admin = new Flags(path.join(__dirname, '../settings/flags.json'));

        let result = {};

        switch (Message.split(' ')[0]) {
            case "!m":
            case "!admin":

                if (!admin.hasPermission(Player.Auth, 'menu_access')) {
                    result = admin.PrintNoAccess(Player)
                    break;
                }
                //const menuTitle = `^r${Server.Hostname}\n^yAdmin Menu`;
                const menuTitle = mainMenuTitle(Server.Hostname);
                result["ShowMenu"] = {
                    Title: menuTitle,
                    Callback: "ClientMenuHandle",
                    Exit: true,
                    EntityId: Player.EntityId,
                    Items: this.mainMenuItems(Player)
                };
                break;

            case "@@":
                if (!admin.hasPermission(Player.Auth, 'chat')) {
                    result = admin.PrintNoAccess(Player)
                    break;
                }
                const msg = Message.substring(Message.indexOf(' ') + 1)

                  result["PrintChat"] = {
                    EntityId: 0,
                    Message: msg
                };
                break;

            case "@":
                if (!admin.hasPermission(Player.Auth, 'chat')) {
                    result = admin.PrintNoAccess(Player)
                    break;
                }

                const hudmsg = `${Player.Name}: ${Message.substring(Message.indexOf(' ') + 1)}`
                const TeamSay = Type == 'say' ? false : true


                   result["ShowHudMessage"] = {
                     EntityId: 0,
                     TeamSay: TeamSay,
                     Message: hudmsg
                };
                break;

            default:
                return null;

        }

        return result;
    }

    mainMenuItems(Player) {
        const admin = new Flags(path.join(__dirname, '../settings/flags.json'));

        let menuItems = [
            {
                Info: "KickMenu",
                Text: mainMenuKickName(),
                Disabled: !admin.hasPermission(Player.Auth, 'kick'),
                Extra: "kmenu"
            },
            {
                Info: "BanMenu",
                Text:  mainMenuBanName(),
                Disabled: !admin.hasPermission(Player.Auth, 'ban'),
                Extra: "bmenu"
            },
            {
                Info: "UnbanMenu",
                Text:  mainMenuUnbanName(),
                Disabled: !admin.hasPermission(Player.Auth, 'unban'),
                Extra: "ubmenu"
            },
            {
                Info: "SlayMenu",
                Text: mainMenuSlayName(),
                Disabled: !admin.hasPermission(Player.Auth,'slay'),
                Extra: "smenu"
            },
            {
                Info: "TeamMenu",
                Text: mainMenuTeamName(),
                Disabled: !admin.hasPermission(Player.Auth,'kick'),
                Extra: "tmenu"
            },
            {
                Info: "MapMenu",
                Text: mainMenuMapName(),
                Disabled: !admin.hasPermission(Player.Auth,'map'),
                Extra: "mmenu"
            }/*,
            {
                Info: "Rcon Menu",
                Text: "Rcon",
                Disabled: !admin.hasPermission(Player.Auth,'rcon'),
                Extra: "extra_item_6"
            },
            {
                Info: "PasswordMenu",
                Text: "Password Menu",
                Disabled: !admin.hasPermission(Player.Auth,'sv_password'),
                Extra: "extra_item_7"
            }*/
        ]
        return menuItems;
    }
}

module.exports = ClientSay;