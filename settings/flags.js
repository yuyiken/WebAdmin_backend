const fs = require('fs');

// Mapa de flags a permisos
const FLAG_PERMISSIONS = {
    'a': 'immunity',
    'b': 'reservation',
    'c': 'kick',
    'd': 'ban',
    'e': 'slay',
    'f': 'map',
    'g': 'cvar',
    'h': 'cfg',
    'i': 'chat',
    'j': 'team',
    'k': 'sv_password',
    'l': 'rcon',
    'm': 'custom_level_A',
    'n': 'custom_level_B',
    'o': 'custom_level_C',
    'p': 'custom_level_D',
    'q': 'custom_level_E',
    'r': 'custom_level_F',
    's': 'custom_level_G',
    't': 'custom_level_H',
    'u': 'menu_access'
  };
  
  class Flags {
    constructor(filePath) {
      this.filePath = filePath;
      this.data = this.loadFlags();
    }
  
    // Cargar el archivo JSON
    loadFlags() {
      try {
        const rawData = fs.readFileSync(this.filePath);
        return JSON.parse(rawData);
      } catch (error) {
        console.error('Error loading flags file:', error);
        return { flags: [] };
      }
    }
  
    // Obtener los permisos de una SteamID
    getPermissions(steamId) {
      const entry = this.data.flags.find(flag => flag.steamid === steamId);
      if (entry) {
        return this.parseFlags(entry.flags);
      } else {
        // Retornar permisos vacíos si la SteamID no se encuentra
        return {};
      }
    }
  
    // Parsear los flags en un objeto de permisos
    parseFlags(flagsString) {
      const permissions = {};
      for (const [flag, permission] of Object.entries(FLAG_PERMISSIONS)) {
        permissions[permission] = flagsString.includes(flag);
      }
      return permissions;
    }
  
    // Verificar si un usuario tiene un permiso específico
    hasPermission(steamId, permission) {
      const permissions = this.getPermissions(steamId);
      return permissions[permission] === true;
    }
    PrintNoAccess(Player){
        let result = {};
        const msg = `^4* ^1You have no access to this command.`;
        
        result["PrintChat"] = {
            EntityId: Player.EntityId,
            Message: msg
        };
        return result;
    }
  }
  module.exports = Flags;