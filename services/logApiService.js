const ClientSay = require('../events/clientsay.js');
const ClientConnect = require('../events/clientconnect.js');
const ClientDisconnect = require('../events/clientdisconnect.js');
const ClientCommand = require('../events/clientcommand.js');
const ClientKill = require('../events/clientkill.js');
const ClientUserInfoChanged = require('../events/clientuserinfochanged.js');
const ServerActivate = require('../events/serveractivate.js');
const ServerDeactivate = require('../events/serverdeactivate.js');
const ServerInfo = require('../events/serverinfo.js');
const ServerAlertMessage = require('../events/serveralertmessage.js');
const ClientMenuHandle = require('../events/clientmenuhandle.js');
const ClientPutInServer = require('../events/clientputinserver.js');

class LogAPI {
    /**
     * Method to handle the received event
     * @param {Object} request - Object containing the event data.
     * @returns {Object|null} Event result or null if the event was not found.
     */
    async OnEvent(request) {
        // If the event is not empty
        if (request && request.Event) {
            // Check if the method exists in this class
            if (typeof this[request.Event] === 'function') {
                // Process parameters as an array
                const parameters = Object.values(request);

                // Call the corresponding method and return the result
                return this[request.Event](...parameters);
            }
        }

        // Return null if the event was not found or the method does not exist
        return null;
    }

    /**
     * Method to handle the ServerActivate event
     * @param {string} Event - Event name.
     * @param {Object} Server - Server information.
     * @param {string} EdictCount - Entity count in the server.
     * @param {string} ClientMax - Maximum number of clients allowed in the server.
     * @returns {Object|null} LogAPI commands for the server or null.
     */
    async ServerActivate(Event, Server, EdictCount, ClientMax) {
        let result = new ServerActivate();

        return await result.generateResponse(Event, Server, EdictCount, ClientMax);
    }

    /**
     * Method to handle the ServerDeactivate event
     * @param {string} Event - Event name.
     * @param {Object} Server - Server information.
     * @returns {Object|null} LogAPI commands for the server or null.
     */
    async ServerDeactivate(Event, Server) {
        let result = new ServerDeactivate();

        return await result.generateResponse(Event, Server);
    }

    /**
     * Method to handle the ServerAlertMessage event
     * @param {string} Event - Event name.
     * @param {Object} Server - Server information.
     * @param {string} Type - Alert message type.
     * @param {string} Message - Log message string.
     * @returns {Object|null} LogAPI commands for the server or null.
     */
    async ServerAlertMessage(Event, Server, Type, Message) {
        let result = new ServerAlertMessage();

        return await result.generateResponse(Event, Server, Type, Message);
    }

    /**
     * Method to handle the ServerInfo event
     * @param {string} Event - Event name.
     * @param {Object} Server - Server information.
     * @returns {Object|null} LogAPI commands for the server or null.
     */
    async ServerInfo(Event, Server) {
        let result = new ServerInfo();

        return await result.generateResponse(Event, Server);
    }

    /**
     * Method to handle the ClientConnect event
     * @param {string} Event - Event name.
     * @param {Object} Server - Server information.
     * @param {Object} Player - Player information.
     * @returns {Object|null} LogAPI commands for the server or null.
     */
    async ClientConnect(Event, Server, Player) {
        let result = new ClientConnect();

        return await result.checkPlayer(Player);

    }

    /**
     * Method to handle the ClientPutInServer event
     * @param {string} Event - Event name.
     * @param {Object} Server - Server information.
     * @param {Object} Player - Player information.
     * @returns {Object|null} Result containing commands or null.
     */
    async ClientPutInServer(Event, Server, Player) {
        let result = new ClientPutInServer();

         return await result.generateResponse(Event, Server, Player);
    }

    /**
     * Method to handle the ClientDisconnect event
     * @param {string} Event - Event name.
     * @param {Object} Server - Server information.
     * @param {Object} Player - Player information.
     * @returns {Object|null} LogAPI commands for the server or null.
     */
    async ClientDisconnect(Event, Server, Player) {
        let result = new ClientDisconnect();

        return await result.generateResponse(Event, Server, Player);
    }

    /**
     * Method to handle the ClientKill event
     * @param {string} Event - Event name.
     * @param {Object} Server - Server information.
     * @param {Object} Player - Player information.
     * @returns {Object|null} LogAPI commands for the server or null.
     */
    async ClientKill(Event, Server, Player) {
        let result = new ClientKill();

        return await result.generateResponse(Event, Server, Player);
    }

    /**
     * Method to handle the ClientUserInfoChanged event
     * @param {string} Event - Event name.
     * @param {Object} Server - Server information.
     * @param {Object} Player - Player information.
     * @param {string} InfoBuffer - KeyInfoBuffer.
     * @returns {Object|null} LogAPI commands for the server or null.
     */
    async ClientUserInfoChanged(Event, Server, Player, InfoBuffer) {
        let result = new ClientUserInfoChanged();

        return await result.generateResponse(Event, Server, Player, InfoBuffer);
    }

    /**
     * Method to handle the ClientCommand event
     * @param {string} Event - Event name.
     * @param {Object} Server - Server information.
     * @param {Object} Player - Player information.
     * @param {string} Command - Command.
     * @param {string} Args - Command arguments.
     * @returns {Object|null} LogAPI commands for the server or null.
     */
    async ClientCommand(Event, Server, Player, Command, Args) {
        let result = new ClientCommand();

        return await result.generateResponse(Event, Server, Player, Command, Args);
    }

    /**
     * Method to handle the ClientSay event
     * @param {string} Event - Event name.
     * @param {Object} Server - Server information.
     * @param {Object} Player - Player information.
     * @param {string} Type - Type (say or say_team).
     * @param {string} Message - Message sent.
     * @returns {Object|null} LogAPI commands for the server or null.
     */

    async ClientSay(Event, Server, Player, Type, Message) {

        let result = new ClientSay();

        return await result.generateResponse(Server, Player, Type, Message);

    }

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

    async ClientMenuHandle(Event, Server, Player, Item) {

        let result = new ClientMenuHandle();
        let test = await result.generateResponse(Event, Server, Player, Item);
        console.log(test);
        
        return test;

    }
}

module.exports = LogAPI;