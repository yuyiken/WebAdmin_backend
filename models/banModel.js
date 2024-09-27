const mongoose = require('mongoose');

const banSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  steamID: {
    type: String,
    required: true,
  },
  steamID64: {
    type: String,
  },
  steamUrlAvatar: {
    type: String,
  },
  nick: {
    type: String,
    required: true,
  },
  aSteamID: {
    type: String,
  },
  aNick: {
    type: String,
  },
  banReason: {
    type: String,
  },
  banCreated: {
    type: Date, // Solo se crea cuando se usa BanPlayer
  },
  banLength: {
    type: Number, // Duración del ban en minutos
    default: -1,  // -1 significa no baneado
  },
  banKicks: {
    type: Number,
    default: 0,
  },
  banTimes: {
    type: Number, // 0 = activo, >0 indica cuántas veces ha sido baneado
    default: 0,
  },
  banExpires: {
    type: Date,
    default: null, // Null cuando no hay expiración activa
  },
}, { timestamps: true });

// Middleware para calcular `banExpires` antes de guardar
banSchema.pre('save', function (next) {
  if (this.isModified('banLength') && this.banCreated) {
    if (this.banLength > 0) {
      // Calcular la fecha de expiración si hay un ban temporal
      this.banExpires = new Date(this.banCreated.getTime() + this.banLength * 60000);
    } else if (this.banLength === -1) {
      // Ban permanente, sin fecha de expiración
      this.banExpires = null;
    }
  }
  next();
});

module.exports = mongoose.model('JSBan', banSchema);
