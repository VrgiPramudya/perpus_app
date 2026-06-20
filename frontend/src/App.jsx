import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DataBuku from './pages/DataBuku';
import DataAnggota from './pages/DataAnggota';
import Peminjaman from './pages/Peminjaman'; // Import baru

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/databuku" element={<DataBuku />} />
        <Route path="/anggota" element={<DataAnggota />} />
        <Route path="/peminjaman" element={<Peminjaman />} /> 
      </Routes>
    </BrowserRouter>
  );
}