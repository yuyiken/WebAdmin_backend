const { AddPlayer, CheckPlayer } = require('../db/mongoquerys')
const {calcularDiferencia} = require('../functions')
class ClientConnect {
    /**
      * Method to handle the ClientConnect event
      * @param {string} Event - Event name.
      * @param {Object} Server - Server information.
      * @param {Object} Player - Player information.
      * @returns {Object|null} LogAPI commands for the server or null.
      */
    async checkPlayer(Player) {
        
      let result = {};

      try {
        
        const plt = await CheckPlayer(Player.Auth);

        if(!plt){
            await AddPlayer(Player);
        }
        else{
          console.log(plt);
          if(plt.banLength==0){
            const kickcmd = `kick #${Player.UserId} You have been banned for ${plt.banReason} forever by ${plt.aNick}.`
            result["ServerCommand"] = kickcmd
          }else if (plt.banLength>0) {

            const kickcmd = `kick #${Player.UserId} You have been banned for ${plt.banReason} by ${plt.aNick}. Ban expire in: ${calcularDiferencia(plt.banExpires)}.`
            result["ServerCommand"] = kickcmd
          }else result = null
        } 
       
        return result;  

      } catch (error) {
        console.log(error);
        return null;
      }

  }
  
}

module.exports = ClientConnect;