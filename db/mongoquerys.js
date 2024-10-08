const JSBan = require('../models/banModel');

async function BanPlayer(obj) {
  try {
    const player = await JSBan.findOne({ steamID: obj.steamid });

    if (!player) {
      console.log(`Player with steamID ${obj.steamid} not found in the database.`);
      return;
    }

    // Actualiza los datos de ban
    player.banLength = obj.ban_length; // 0 = permanente, >0 = en minutos
    player.banReason = obj.ban_reason;
    player.ip = obj.ip;
    player.aNick = obj.adminnick;
    player.nick = obj.name;
    player.aSteamID = obj.adminsteamid;
    player.banCreated = Date.now();
    player.banTimes += 1;

    if (obj.ban_length > 0) {
      player.banExpires = new Date(player.banCreated.getTime() + obj.ban_length * 60000); // Si el ban es temporal
    } else if (obj.ban_length === 0) {
      player.banExpires = null; // Ban permanente
    }

    await player.save();
    console.log(`${obj.steamid} successfully banned for ${obj.ban_length === 0 ? 'permanent' : obj.ban_length + ' minutes'}.`);
    return player;
  } catch (error) {
    console.error(`Error banning player with steamID ${obj.steamid}: ${error}`);
  }
}

async function UnbanPlayer(steamid) {
  try {
    const player = await JSBan.findOne({ steamID: steamid });

    if (!player) {
      console.log(`Player with steamID ${steamid} not found in the database.`);
      return;
    }

    // Desbanear el jugador
    player.banLength = -1; // No está baneado
    player.banReason = null;
    player.aNick = null;
    player.aSteamID = null;
    player.banExpires = null;
    player.banCreated = null;

    await player.save();
    console.log(`${steamid} successfully unbanned.`);
    return player
  } catch (error) {
    console.error(`Error unbanning player with steamID ${steamid}: ${error}`);
  }
}

async function AddPlayer(Player) {
  try {
    const existingPlayer = await JSBan.findOne({ steamID: Player.Auth });

    if (existingPlayer) {
      console.log(`Player with steamID ${Player.Auth} already exists in the database.`);
      return;
    }

    const newPlayer = new JSBan({
      ip: Player.Address,
      steamID: Player.Auth,
      steamID64: Player.ip,
      nick: Player.Name,
      banLength: -1, // Jugador no baneado inicialmente
    });

    await newPlayer.save();
    console.log(`Player ${Player.Auth} successfully added to the database.`);
  } catch (error) {
    console.error(`Error adding player to the database: ${error}`);
  }
}

async function CheckPlayer(steamid) {
  try {
    const player = await JSBan.findOne({ steamID: steamid });

    if (!player) {
      console.log(`Player with steamID ${steamid} not found in the database.`);
      return; // Jugador no encontrado, no está baneado
    }

    // Si el jugador no está baneado
    if (player.banLength === -1) {
      return; // No está baneado
    }

    // Si el jugador está baneado temporalmente, revisamos si ha expirado el ban
    if (player.banLength > 0 && player.banExpires < Date.now()) {
      // El ban ha expirado, desbaneamos al jugador
      player.banLength = -1; // Desbanear
      player.banReason = null;
      player.aNick = null;
      player.aSteamID = null;
      player.banExpires = null;
      player.banCreated = null;

      await player.save();
      console.log(`Player ${steamid} had their ban expired and is now unbanned.`);
      return; // El ban ha expirado, no está baneado
    }

    // Si sigue baneado, incrementamos los kicks
    player.banKicks += 1;
    await player.save();

    console.log(`Player ${steamid} is still banned, kick count increased to ${player.banKicks}.`);
    return player; // El jugador está baneado
  } catch (error) {
    console.error(`Error checking ban status for player with steamID ${steamid}: ${error}`);
    return; // En caso de error, asumimos que no está baneado
  }
}

async function GetBannedPlayers() {
  try {
    // Buscar jugadores que están actualmente baneados (banLength != -1)
    const bannedPlayers = await JSBan.find({ banLength: { $ne: -1 } });

    if (bannedPlayers.length === 0) {
      console.log("No banned players found.");
      return [];
    }

    // Crear un listado de jugadores baneados
    const bannedList = bannedPlayers.map(player => ({
      steamID: player.steamID,
      nick: player.nick,
      banReason: player.banReason,
      adminNick: player.aNick,
      adminSteamID: player.aSteamID,
      banLength: player.banLength === 0 ? "Permanent" : `${player.banLength} minutes`,
      banExpires: player.banExpires ? player.banExpires : "N/A",
      banCreated: player.banCreated,
      banTimes: player.banTimes,
    }));

    console.log("Banned players list generated successfully.");
    return bannedList;
  } catch (error) {
    console.error(`Error retrieving banned players: ${error}`);
    return [];
  }
}

async function GetBannedPlayer(steamid) {
  try {
    // Buscar jugadores que están actualmente baneados (banLength != -1)
    const player = await JSBan.findOne({ steamID: steamid });

    if (!player) {
      console.log(`Player with steamID ${steamid} not found in the database.`);
      return; // Jugador no encontrado, no está baneado
    }

    return player;
  } catch (error) {
    console.error(`Error retrieving banned player: ${error}`);
    return;
  }
}

module.exports = {
  BanPlayer,
  UnbanPlayer,
  AddPlayer,
  CheckPlayer,
  GetBannedPlayers,
  GetBannedPlayer
};
