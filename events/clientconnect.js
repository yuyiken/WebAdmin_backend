const { AddPlayerIntoDB, findPlayerInDB } = require('../db/mongoquerys')
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
        
        const player = await findPlayerInDB(Player);

        if(!player){
            await AddPlayerIntoDB(Player);
            console.log(`Player ${Player.Auth} added successfully`);
        }
        else console.log(`Player ${player.steamID} are actually in the db`);
       
        return null;  

      } catch (error) {
        console.log(error);
        return null;
      }
      /*  
      try {
          const dbTest = await checkPlayerWhenJoin(Player.Auth)
          let obj = {}
          if (dbTest != null) {
              obj = dbTest[0]
              console.log(obj[0]);
              const kickcmd = `kick #${Player.UserId} You have been banned for ${obj[0].ban_reason} until ${obj[0].ban_expire} by ${obj[0].anick}.`
              result["ServerCommand"] = kickcmd
              await updateKicks(dbTest.id, dbTest.ban_kicks)
          }
          else {
              result = null
          }
      } catch (error) {
          console.log(error);
          return null;
      };
      */
      return result;
  }
  
}

module.exports = ClientConnect;