const mongoose = require('mongoose');

const BukuSchema = new mongoose.Schema({
    isbn: String,
    judul: { type: String, required: true },
    pengarang: String,
    penerbit: String,
    tahun_terbit: Number,
    kategori: String,
    stok: { type: Number, required: true },
    rak_lokasi: String
});

module.exports = mongoose.model('Buku', BukuSchema, 'buku');