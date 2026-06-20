const express = require('express');
const router = express.Router();
const Peminjaman = require('../models/Peminjaman');
const Buku = require('../models/Buku');
// WAJIB DITAMBAHKAN AGAR POPULATE TIDAK ERROR 500:
const Anggota = require('../models/Anggota'); 
const Petugas = require('../models/Petugas'); 

// 1. ENDPOINT: GET Biasa
router.get('/', async (req, res) => {
    try {
        const peminjaman = await Peminjaman.find();
        res.json(peminjaman);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. ENDPOINT: GET Advanced (Menarik nama pakai Populate)
router.get('/advanced', async (req, res) => {
    try {
        const peminjaman = await Peminjaman.find()
            .populate('id_anggota')
            .populate('id_buku')
            .populate('id_petugas');
        res.json({ data: peminjaman });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. ENDPOINT: POST (Tambah Transaksi & Potong Stok)
router.post('/', async (req, res) => {
    try {
        const { id_anggota, id_buku, tanggal_pinjam, tanggal_kembali_seharusnya, id_petugas, status_transaksi } = req.body;

        const buku = await Buku.findById(id_buku);
        if (!buku) return res.status(404).json({ message: "Buku tidak ditemukan!" });
        if (buku.stok < 1) return res.status(400).json({ message: "Stok buku ini sudah habis!" });

        const peminjamanBaru = new Peminjaman({
            id_anggota,
            id_buku,
            tanggal_pinjam,
            tanggal_kembali_seharusnya,
            id_petugas,
            status_transaksi: status_transaksi || 'Dipinjam'
        });
        await peminjamanBaru.save();

        buku.stok = buku.stok - 1;
        await buku.save();

        res.json({ message: "Transaksi sukses", data: peminjamanBaru });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. ENDPOINT: PUT (Kembalikan Buku & Tambah Stok)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status_transaksi } = req.body;

        const peminjaman = await Peminjaman.findById(id);
        if (!peminjaman) return res.status(404).json({ message: "Transaksi tidak ditemukan!" });

        if (peminjaman.status_transaksi === 'Dipinjam' && status_transaksi === 'Selesai') {
            await Buku.findByIdAndUpdate(peminjaman.id_buku, { $inc: { stok: 1 } });
        }

        peminjaman.status_transaksi = status_transaksi;
        await peminjaman.save();

        res.json({ message: "Buku dikembalikan", data: peminjaman });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. ENDPOINT: DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Peminjaman.findByIdAndDelete(id);
        res.json({ message: "Riwayat dihapus." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;