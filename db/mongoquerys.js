const JSBan = require('../models/banModel');


async function findPlayerInDB(Player){
    try {

        const player = await JSBan.findOne({ steamID: Player.Auth });

        return player

      } catch (error) {

        console.log(`Some error finding a player in DB: \n ${error}`)
        
      }
 
}

async function AddPlayerIntoDB(Player){
    try {

        const newPlayer = new JSBan({
        
            ip: Player.Address,
            steamID: Player.Auth,
            steamID64: Player.ip,
            nick: Player.Name,

        });
        await newPlayer.save();
        console.log(`${Player.Auth} successfully added into database`);
        
      } catch (error) {

        console.log(`Some error finding a player in DB: \n ${error}`)
        
      }
 
}

async function BanPlayer(obj){
    try {

        const ban = await JSBan.findOne({ steamID: obj.steamid });

        if(ban){
            ban.ip =  obj.ip,
            ban.nick= obj.name,
            ban.aSteamID = obj.adminsteamid,
            ban.aNick = obj.adminnick,
            ban.banReason = obj.ban_reason,
            ban.banLength = obj.ban_length,
            ban.banCreated = Date.now(),
            ban.banExpires = new Date(ban.banCreated.getTime() + ban.banLength * 60000),
            ban.banTimes = ban.banTimes+1

            await ban.save();
        }

        const updatedBan = await JSBan.findOneAndUpdate({ steamID: obj.steamid }, ban);

        if (!updatedBan) {
            console.log(`The ban has not been added`);
            
        }else   console.log(`${obj.steamid} successfully added into database`);
     
        
      } catch (error) {

        console.log(`Some error finding a player in DB: \n ${error}`)
        
      }
 
}

//Ban Player
//Unban Player
//Check If Banned


module.exports = {
    findPlayerInDB,
    AddPlayerIntoDB,
    BanPlayer,
}