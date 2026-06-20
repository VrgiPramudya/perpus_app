const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Buku = require('../models/Buku');
const Peminjaman = require('../models/Peminjaman');

// A. Tambah Data (POST)
router.post('/', async (req, res) => {
    try {
        const bukuBaru = await Buku.create(req.body);
        res.status(201).json({ message: "Buku berhasil ditambahkan", data: bukuBaru });
    } catch (err) { 
        res.status(400).json({ error: err.message }); 
    }
});

// B. Lihat Data Lanjutan: Search, Filter, Range, Sort, Pagination (GET)
router.get('/advanced', async (req, res) => {
    try {
        const { judul, kategori, minStok, maxStok, sortBy, sortOrder, page, limit } = req.query;
        let queryObj = {};

        // 1. Search & Filter
        if (judul) queryObj.judul = { $regex: judul, $options: 'i' }; // Search LIKE
        if (kategori) queryObj.kategori = kategori; // Filter Tepat
        
        // 2. Cari Berdasarkan Range Tertentu (Stok)
        if (minStok || maxStok) {
            queryObj.stok = {};
            if (minStok) queryObj.stok.$gte = parseInt(minStok);
            if (maxStok) queryObj.stok.$lte = parseInt(maxStok);
        }

        // 3. Pagination Setup
        const p = parseInt(page) || 1;
        const l = parseInt(limit) || 10;
        const skip = (p - 1) * l;

        // 4. Sorting Setup
        let sortObj = {};
        if (sortBy) sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const data = await Buku.find(queryObj).sort(sortObj).skip(skip).limit(l);
        const total = await Buku.countDocuments(queryObj);
        
        res.json({ currentPage: p, totalData: total, data: data });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// C. Update (PUT)
router.put('/:id', async (req, res) => {
    try {
        const updateBuku = await Buku.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json({ message: "Buku terupdate", data: updateBuku });
    } catch (err) { 
        res.status(400).json({ error: err.message }); 
    }
});

// D. Delete (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // LOGIKA CEGAH HAPUS: Cari apakah ID buku ini ada di tabel Peminjaman
        const cekTransaksi = await Peminjaman.findOne({ id_buku: id });
        
        if (cekTransaksi) {
            // Jika ketemu, tolak proses delete
            return res.status(400).json({ 
                message: "Gagal! Buku ini tidak bisa dihapus karena masih tercatat di riwayat transaksi peminjaman." 
            });
        }

        await Buku.findByIdAndDelete(id);
        res.json({ message: "Data buku berhasil dihapus." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;