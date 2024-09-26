class ServerInfo {
    /**
      * Method to handle the ServerInfo event
      * @param {string} Event - Event name.
      * @param {Object} Server - Server information.
      * @returns {Object|null} LogAPI commands for the server or null.
      */
    async generateResponse(Event, Server) {
        return null;
    }
}

module.exports = ServerInfo;