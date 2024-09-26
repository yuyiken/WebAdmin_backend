const { pool } = require('./database')

//SELECT When Player Joins

async function checkPlayerWhenJoin(steamid) {
  // Ejecuta la consulta que actualiza el campo 'expired' si corresponde
  await pool.query(
      `UPDATE mb_bans 
       SET expired = 1 
       WHERE steamid = ? 
       AND expired = 0 
       AND ban_expire <= UNIX_TIMESTAMP()`,
      [
          steamid, // steamid
      ]
  );

  // Luego, selecciona si el jugador aún tiene bans activos (expired = 0)
  const dbTest = await pool.query(
      `SELECT * FROM mb_bans WHERE steamid = ? AND expired = 0`,
      [
          steamid, // steamid
      ]
  );

  // Si hay registros, los devuelve; si no, retorna null
  if (dbTest[0].length > 0) {
      return dbTest;
  } else {
      return null;
  }
}

//Insert a ban into db

async function insertBanIntoDB(obj){
    const  dbTest = await pool.query(
        `INSERT INTO mb_bans (steamid, nick, ip, asteamid, ban_reason, ban_length, anick, server_ip)
         SELECT ?, ?, ?, ?, ?, ?, ?, ? 
         WHERE NOT EXISTS (
           SELECT steamid FROM mb_bans WHERE steamid = ? AND expired = 0
         )`,
        [
          obj.steamid, // Banned Player Steam ID
          obj.name, // Banned Player Nickname
          obj.ip, // ip
          obj.adminsteamid, // Admin Steamid
          obj.ban_reason, // Ban Reason
          obj.ban_length, // Ban Length in minutes
          obj.adminnick, // Admin Nickname
          obj.serverip, // Server IP? Name
          obj.steamid// Banned Pplayer SteamID for (SubQuery)
        ]
      );
      return dbTest;
}
async function updateKicks(id, kicks) {
    
    const  dbTest = await pool.query("UPDATE mb_bans set ban_kicks = '?' WHERE id = ?", [kicks++, id]);
    return dbTest;
}

module.exports = {checkPlayerWhenJoin, insertBanIntoDB, updateKicks}