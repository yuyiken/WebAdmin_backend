class ClientUserInfoChanged {
    /**
     * Method to handle the ClientUserInfoChanged event
     * @param {string} Event - Event name.
     * @param {Object} Server - Server information.
     * @param {Object} Player - Player information.
     * @param {string} InfoBuffer - KeyInfoBuffer.
     * @returns {Object|null} LogAPI commands for the server or null.
     */

    async generateResponse(Event, Server, Player, InfoBuffer) {
        return null;
    }
}

module.exports = ClientUserInfoChanged;