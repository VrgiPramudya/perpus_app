const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 1. Import cors

const app = express();

app.use(cors()); // 2. Aktifkan cors (WAJIB di atas routes)
app.use(express.json());

// Koneksi ke Database MongoDB (Ganti nama DB jika perlu)
mongoose.connect('mongodb://localhost:27017/db_perpustakaan')
  .then(() => console.log('Database MongoDB Terhubung!'))
  .catch(err => console.log('Gagal Konek Database:', err));

// Mendaftarkan semua Routes
app.use('/anggota', require('./routes/anggotaRoute'));
app.use('/buku', require('./routes/bukuRoute'));
app.use('/petugas', require('./routes/petugasRoute'));
app.use('/peminjaman', require('./routes/peminjamanRoute'));

// Menjalankan Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});