const express = require('express');
const router = express.Router();
const Petugas = require('../models/Petugas');

router.post('/', async (req, res) => {
    try { 
        const data = await Petugas.create(req.body); 
        res.status(201).json(data); 
    } 
    catch (err) { 
        res.status(400).json({ 
            error: err.message 
        }); 
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Cari petugas berdasarkan username
        const petugas = await Petugas.findOne({ username: username });
        
        // Jika username tidak ada atau password salah
        if (!petugas || petugas.password !== password) {
            return res.status(401).json({ message: "Username atau password salah!" });
        }

        // Jika sukses login
        res.json({ 
            message: "Login berhasil", 
            data: petugas 
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/advanced', async (req, res) => {
    try {
        const { nama_petugas, jabatan, sortBy, sortOrder, page, limit } = req.query;
        let queryObj = {};
        if (nama_petugas) queryObj.nama_petugas = { $regex: nama_petugas, $options: 'i' };
        if (jabatan) queryObj.jabatan = jabatan;

        const p = parseInt(page) || 1; const l = parseInt(limit) || 10;
        let sortObj = {}; if (sortBy) sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const data = await Petugas.find(queryObj).sort(sortObj).skip((p - 1) * l).limit(l);
        res.json({ total: data.length, data });
    } catch (err) { 
        res.status(500).json({ 
            error: err.message 
        }); 
    }
});

router.put('/:id', async (req, res) => {
    try { 
        const data = await Petugas.findByIdAndUpdate(req.params.id, req.body, {new: true}); 
        res.json(data); 
    } 
    catch (err) { 
        res.status(400).json({ 
            error: err.message 
        }); 
    }
});

router.delete('/:id', async (req, res) => {
    try { 
        await Petugas.findByIdAndDelete(req.params.id); 
        res.json({ message: "Dihapus" }); 
    } 
    catch (err) { 
        res.status(500).json({ 
            error: err.message 
        }); 
    }
});

module.exports = router;