class ServerAlertMessage {
    /**
    * Method to handle the ServerAlertMessage event
    * @param {string} Event - Event name.
    * @param {Object} Server - Server information.
    * @param {string} Type - Alert message type.
    * @param {string} Message - Log message string.
    * @returns {Object|null} LogAPI commands for the server or null.
    */
    async generateResponse(Event, Server, Type, Message) {
        return null;
    }
}

module.exports = ServerAlertMessage;