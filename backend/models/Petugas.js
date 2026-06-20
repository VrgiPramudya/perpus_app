const mongoose = require('mongoose');

const PetugasSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    nama_petugas: { type: String, required: true },
    jabatan: String,
});

module.exports = mongoose.model('Petugas', PetugasSchema, 'petugas');