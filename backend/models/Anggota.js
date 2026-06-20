const mongoose = require('mongoose');

const AnggotaSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    alamat: { type: String, required: true },
    nomor_hp: { type: String, required: true },
    email: { type: String, required: true },
    tanggal_daftar: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Anggota', AnggotaSchema, 'anggota');