const mongoose = require('mongoose');

const PeminjamanSchema = new mongoose.Schema({
    // Penambahan type ObjectId dan ref untuk relasi tabel
    id_anggota: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Anggota', 
        required: true 
    },
    id_buku: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Buku', 
        required: true 
    },
    id_petugas: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Petugas', 
        required: true 
    },
    tanggal_pinjam: { 
        type: Date, 
        required: true 
    },
    tanggal_kembali_seharusnya: { 
        type: Date, 
        required: true 
    },
    status_transaksi: { 
        type: String, 
        required: true 
    }
});

// Pastikan nama modelnya 'Peminjaman' agar sesuai
module.exports = mongoose.model('Peminjaman', PeminjamanSchema, 'peminjaman');