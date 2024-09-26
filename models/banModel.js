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
    type: Date,
    default: -1, // Genera el timestamp cuando se crea el documento
  },
  banLength: {
    type: Number, // Duración del ban en minutos
    default: -1,
  },
  banKicks: {
    type: Number,
    default: 0,
  },
  banTimes: {
    type: Number, // 0 = activo, 1 = expirado
    default: 0,
  },
  banExpires: {
    type: Date,
    default: 0,
  },
}, { timestamps: true });


// Middleware para calcular ban_expire antes de guardar
banSchema.pre('save', function (next) {
  if (this.isModified('banLength')) {
    this.banExpires = new Date(this.banCreated.getTime() + this.ban_length * 60000); // ban_length en minutos
  }
  next();
});

module.exports = mongoose.model('JSBan', banSchema);
