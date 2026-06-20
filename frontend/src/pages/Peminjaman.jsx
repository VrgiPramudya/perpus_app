import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeftRight, Search, Filter, Plus, Trash2, CheckCircle, X } from 'lucide-react';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';

export default function Peminjaman() {
  const [pinjamList, setPinjamList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('terbaru');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anggotaOptions, setAnggotaOptions] = useState([]);
  const [bukuOptions, setBukuOptions] = useState([]);

  const [formData, setFormData] = useState({
    id_anggota: '', id_buku: '', tanggal_pinjam: new Date().toISOString().split('T')[0], tanggal_kembali_seharusnya: ''
  });

  const fetchPeminjaman = async () => {
    try {
      const response = await axios.get('http://localhost:3000/peminjaman/advanced');
      setPinjamList(response.data.data);
    } catch (error) { console.error("Gagal mengambil data:", error); }
  };

  const fetchDropdownOptions = async () => {
    try {
      const resAnggota = await axios.get('http://localhost:3000/anggota/advanced');
      const resBuku = await axios.get('http://localhost:3000/buku/advanced');
      setAnggotaOptions(resAnggota.data.data);
      setBukuOptions(resBuku.data.data);
    } catch (error) { console.error("Gagal mengambil data dropdown:", error); }
  };

  useEffect(() => { fetchPeminjaman(); fetchDropdownOptions(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData({ id_anggota: '', id_buku: '', tanggal_pinjam: new Date().toISOString().split('T')[0], tanggal_kembali_seharusnya: '' });
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payloadData = { ...formData, status_transaksi: 'Dipinjam', id_petugas: localStorage.getItem('id_petugas') };
      await axios.post('http://localhost:3000/peminjaman', payloadData);
      Swal.fire({ title: 'Berhasil!', text: 'Transaksi peminjaman sukses dibuat.', icon: 'success', confirmButtonColor: '#4f46e5', timer: 2000 });
      resetForm();
      fetchPeminjaman();
    } catch (error) { Swal.fire('Gagal!', error.response?.data?.message || 'Terjadi kesalahan sistem.', 'error'); }
  };

  const handleKembalikan = (id) => {
    Swal.fire({ title: 'Konfirmasi', text: "Tandai Selesai?", icon: 'question', showCancelButton: true, confirmButtonColor: '#4f46e5', confirmButtonText: 'Ya, Selesai!' }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`http://localhost:3000/peminjaman/${id}`, { status_transaksi: 'Selesai' });
          Swal.fire('Berhasil!', 'Buku dikembalikan.', 'success'); fetchPeminjaman();
        } catch (error) { Swal.fire('Gagal!', 'Kesalahan server.', 'error'); }
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({ title: 'Hapus Riwayat?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Hapus!' }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/peminjaman/${id}`);
          Swal.fire('Terhapus!', 'Riwayat dihapus.', 'success'); fetchPeminjaman();
        } catch (error) { Swal.fire('Gagal!', 'Terjadi kesalahan.', 'error'); }
      }
    });
  };

  let processedData = pinjamList.filter((pinjam) => 
    pinjam._id.includes(searchTerm) || (pinjam.id_anggota && pinjam.id_anggota.nama.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  processedData.sort((a, b) => {
    return sortOrder === 'terbaru' ? new Date(b.tanggal_pinjam) - new Date(a.tanggal_pinjam) : new Date(a.tanggal_pinjam) - new Date(b.tanggal_pinjam);
  });

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Transaksi Peminjaman</h1>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors">
            <Plus className="w-5 h-5" /> Pinjamkan Buku
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap justify-between gap-4 items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute inset-y-0 left-3 my-auto h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Cari ID Transaksi atau Nama Peminjam..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-indigo-500 bg-white" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="terbaru">Terbaru - Terlama</option>
                <option value="terlama">Terlama - Terbaru</option>
              </select>
            </div>
          </div>

          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-gray-100 text-sm">
                <th className="p-4 w-[20%] font-semibold text-gray-600">ID Transaksi</th>
                <th className="p-4 w-[25%] font-semibold text-gray-600">Nama Peminjam</th>
                <th className="p-4 w-[15%] font-semibold text-gray-600">Tgl Pinjam</th>
                <th className="p-4 w-[15%] font-semibold text-gray-600">Tenggat Kembali</th>
                <th className="p-4 w-[10%] font-semibold text-gray-600">Status</th>
                <th className="p-4 w-[15%] font-semibold text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {processedData.length > 0 ? (
                processedData.map((pinjam) => (
                  <tr key={pinjam._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-xs font-mono text-gray-500"><div className="truncate" title={pinjam._id}>{pinjam._id}</div></td>
                    <td className="p-4 font-medium text-gray-800"><div className="truncate cursor-help" title={pinjam.id_anggota ? pinjam.id_anggota.nama : 'Unknown'}>{pinjam.id_anggota ? pinjam.id_anggota.nama : 'Unknown'}</div></td>
                    <td className="p-4 text-gray-600 text-sm"><div className="truncate">{new Date(pinjam.tanggal_pinjam).toLocaleDateString('id-ID')}</div></td>
                    <td className="p-4 text-gray-600 text-sm">
                      <div className="truncate">
                        {pinjam.tanggal_kembali_seharusnya ? new Date(pinjam.tanggal_kembali_seharusnya).toLocaleDateString('id-ID') : '-'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="truncate">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${pinjam.status_transaksi === 'Dipinjam' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {pinjam.status_transaksi}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      {pinjam.status_transaksi === 'Dipinjam' && (
                        <button onClick={() => handleKembalikan(pinjam._id)} title="Tandai Selesai" className="cursor-pointer p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"><CheckCircle className="w-4 h-4" /></button>
                      )}
                      <button onClick={() => handleDelete(pinjam._id)} title="Hapus Riwayat" className="cursor-pointer p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="p-8 text-center text-gray-400">Data tidak ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
          {/* Modal content sama seperti sebelumnya... */}
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative">
            <button onClick={resetForm} className="cursor-pointer absolute top-5 right-5 text-gray-400 bg-gray-50 p-2 rounded-full hover:text-red-500 transition-colors"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Input Peminjaman Baru</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Anggota</label>
                <select name="id_anggota" required value={formData.id_anggota} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 bg-white">
                  <option value="" disabled>-- Pilih Anggota Perpus --</option>
                  {anggotaOptions.map(a => <option key={a._id} value={a._id}>{a.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Buku yang Dipinjam</label>
                <select name="id_buku" required value={formData.id_buku} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 bg-white">
                  <option value="" disabled>-- Pilih Buku --</option>
                  {bukuOptions.map(b => <option key={b._id} value={b._id} disabled={b.stok<1}>{b.judul} (Stok: {b.stok})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pinjam</label>
                  <input type="date" name="tanggal_pinjam" required value={formData.tanggal_pinjam} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tenggat Kembali</label>
                  <input type="date" name="tanggal_kembali_seharusnya" required value={formData.tanggal_kembali_seharusnya} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={resetForm} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">Batal</button>
                <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Proses</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}