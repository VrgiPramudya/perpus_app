const express = require('express');
const router = express.Router();
const Anggota = require('../models/Anggota');
const Peminjaman = require('../models/Peminjaman');

// 1. Ambil semua data anggota
router.get('/', async (req, res) => {
    try {
        const anggota = await Anggota.find();
        res.json(anggota);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Ambil data anggota (Advanced)
router.get('/advanced', async (req, res) => {
    try {
        const anggota = await Anggota.find();
        res.json({ data: anggota });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Tambah Anggota Baru (Sesuai Perpus Umum)
router.post('/', async (req, res) => {
    try {
        const { nama, alamat, nomor_hp, email } = req.body;
        
        const anggotaBaru = new Anggota({
            nama,
            alamat,
            nomor_hp,
            email
            // tanggal_daftar tidak perlu dimasukkan, Mongoose akan otomatis mengisi hari ini
        });
        
        await anggotaBaru.save();
        res.status(201).json({ message: "Anggota baru berhasil ditambahkan!", data: anggotaBaru });
    } catch (err) {
        // Mengembalikan error spesifik agar terbaca di frontend
        res.status(400).json({ error: err.message });
    }
});

// 4. Update Data Anggota
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, alamat, nomor_hp, email } = req.body;

        const anggotaDiupdate = await Anggota.findByIdAndUpdate(
            id, 
            { nama, alamat, nomor_hp, email }, 
            { new: true }
        );

        if (!anggotaDiupdate) return res.status(404).json({ message: "Anggota tidak ditemukan!" });
        res.json({ message: "Data anggota berhasil diperbarui!", data: anggotaDiupdate });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 5. Hapus Anggota
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // LOGIKA CEGAH HAPUS: Cari apakah ID anggota ini ada di tabel Peminjaman
        const cekTransaksi = await Peminjaman.findOne({ id_anggota: id });
        
        if (cekTransaksi) {
            // Jika ketemu, tolak proses delete dan kirim pesan error ke frontend
            return res.status(400).json({ 
                message: "Gagal! Anggota ini tidak bisa dihapus karena masih terikat dengan riwayat transaksi peminjaman." 
            });
        }

        // Jika lolos pengecekan (tidak ada transaksi), baru boleh dihapus
        await Anggota.findByIdAndDelete(id);
        res.json({ message: "Data anggota berhasil dihapus." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;