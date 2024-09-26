const path = require('path');
const Flags = require('../settings/flags')
class ClientCommand {
  /**
    * Method to handle the ClientCommand event
    * @param {string} Event - Event name.
    * @param {Object} Server - Server information.
    * @param {Object} Player - Player information.
    * @param {string} Command - Command.
    * @param {string} Args - Command arguments.
    * @returns {Object|null} LogAPI commands for the server or null.
    */

  async generateResponse(Event, Server, Player, Command, Args) {
    const admin = new Flags(path.join(__dirname, '../settings/flags.json'));

    let result = {};

    switch (Message.split(' ')[0]) {
      case "adminmenu":

        if (!admin.hasPermission(Player.Auth, 'menu_access')) {
          result = admin.PrintNoAccess(Player)
          break;
        }
        const menuTitle = `^r${Server.Hostname}\n^yAdmin Menu`;

        result["ShowMenu"] = {
          Title: menuTitle,
          Callback: "ClientMenuHandle",
          Exit: true,
          EntityId: Player.EntityId,
          Items: this.mainMenuItems(Player)
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
        Text: "Kick Menu",
        Disabled: !admin.hasPermission(Player.Auth, 'kick'),
        Extra: "kmenu"
      },
      {
        Info: "BanMenu",
        Text: "Ban Menu",
        Disabled: !admin.hasPermission(Player.Auth, 'ban'),
        Extra: "bmenu"
      },
      {
        Info: "SlayMenu",
        Text: "Slay Menu",
        Disabled: !admin.hasPermission(Player.Auth, 'slay'),
        Extra: "smenu"
      },
      {
        Info: "TeamMenu",
        Text: "Team Menu",
        Disabled: !admin.hasPermission(Player.Auth, 'kick'),
        Extra: "tmenu"
      },
      {
        Info: "MapMenu",
        Text: "Map Menu",
        Disabled: !admin.hasPermission(Player.Auth, 'map'),
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

module.exports = ClientCommand;