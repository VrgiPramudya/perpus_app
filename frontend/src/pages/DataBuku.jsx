import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Search, Plus, X, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';

export default function DataBuku() {
  const [bukuList, setBukuList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null); 
  
  const [formData, setFormData] = useState({
    isbn: '', judul: '', pengarang: '', penerbit: '', tahun_terbit: '', kategori: '', stok: '', rak_lokasi: ''
  });

  const fetchBuku = async () => {
    try {
      const response = await axios.get('http://localhost:3000/buku/advanced');
      setBukuList(response.data.data); 
    } catch (error) { console.error("Gagal mengambil data:", error); }
  };

  useEffect(() => { fetchBuku(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData({ isbn: '', judul: '', pengarang: '', penerbit: '', tahun_terbit: '', kategori: '', stok: '', rak_lokasi: '' });
    setEditId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (buku) => {
    setFormData(buku);
    setEditId(buku._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:3000/buku/${editId}`, formData);
        Swal.fire({ title: 'Berhasil!', text: 'Data buku diperbarui.', icon: 'success', confirmButtonColor: '#2563eb', timer: 2000 });
      } else {
        await axios.post('http://localhost:3000/buku', formData);
        Swal.fire({ title: 'Berhasil!', text: 'Buku baru ditambahkan.', icon: 'success', confirmButtonColor: '#2563eb', timer: 2000 });
      }
      resetForm();
      fetchBuku(); 
    } catch (error) { Swal.fire('Gagal!', error.response?.data?.message || 'Terjadi kesalahan.', 'error'); }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Yakin mau dihapus?', 
      text: "Data buku akan hilang permanen!", 
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonColor: '#d33', 
      cancelButtonColor: '#3085d6', 
      confirmButtonText: 'Ya, Hapus!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/buku/${id}`);
          Swal.fire('Terhapus!', 'Buku berhasil dihapus.', 'success');
          fetchBuku();
        } catch (error) { 
          // PERBAIKAN: Tangkap pesan error asli dari backend
          const errorMsg = error.response?.data?.message || 'Terjadi kesalahan sistem.';
          Swal.fire('Gagal!', errorMsg, 'error'); 
        }
      }
    });
  };

  const filteredBuku = bukuList.filter((buku) => 
    buku.judul.toLowerCase().includes(searchTerm.toLowerCase()) || buku.isbn.includes(searchTerm)
  );

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Data Buku</h1>
          </div>
          <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm">
            <Plus className="w-5 h-5" /> Tambah Buku
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" placeholder="Cari judul buku atau ISBN..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          {/* PERBAIKAN: Mengunci Layout Tabel (table-fixed) */}
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-gray-100 text-sm">
                <th className="p-4 w-[18%] font-semibold text-gray-600">ISBN</th>
                <th className="p-4 w-[32%] font-semibold text-gray-600">Judul Buku</th>
                <th className="p-4 w-[15%] font-semibold text-gray-600">Kategori</th>
                <th className="p-4 w-[10%] font-semibold text-gray-600">Rak</th>
                <th className="p-4 w-[10%] font-semibold text-gray-600 text-center">Stok</th>
                <th className="p-4 w-[15%] font-semibold text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuku.length > 0 ? (
                filteredBuku.map((buku) => (
                  <tr key={buku._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    {/* TRUNCATE: Memotong teks panjang */}
                    <td className="p-4 text-gray-600"><div className="truncate" title={buku.isbn}>{buku.isbn}</div></td>
                    <td className="p-4 font-medium text-gray-800"><div className="truncate cursor-help" title={buku.judul}>{buku.judul}</div></td>
                    <td className="p-4 text-gray-600">
                      <div className="truncate">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs" title={buku.kategori}>{buku.kategori}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600"><div className="truncate" title={buku.rak_lokasi}>{buku.rak_lokasi}</div></td>
                    <td className="p-4 text-center font-bold text-gray-700">{buku.stok}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button onClick={() => handleEdit(buku)} title="Edit Buku" className="cursor-pointer p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(buku._id)} title="Hapus Buku" className="cursor-pointer p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
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

      {/* Modal Form Tambah/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative">
            <button onClick={resetForm} className="cursor-pointer absolute top-5 right-5 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 p-2 rounded-full"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{editId ? 'Edit Data Buku' : 'Tambah Data Buku Baru'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                <input type="text" name="isbn" required value={formData.isbn} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Misal: 978-623..." />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <input type="text" name="kategori" required value={formData.kategori} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Misal: Pemrograman" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Buku</label>
                <input type="text" name="judul" required value={formData.judul} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pengarang</label>
                <input type="text" name="pengarang" required value={formData.pengarang} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Penerbit</label>
                <input type="text" name="penerbit" required value={formData.penerbit} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Terbit</label>
                <input type="number" name="tahun_terbit" required value={formData.tahun_terbit} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                  <input type="number" name="stok" required value={formData.stok} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rak Lokasi</label>
                  <input type="text" name="rak_lokasi" required value={formData.rak_lokasi} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Misal: A-1" />
                </div>
              </div>
              <div className="col-span-2 mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={resetForm} className="cursor-pointer px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium">Batal</button>
                <button type="submit" className="cursor-pointer px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium">{editId ? 'Update Buku' : 'Simpan Buku'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}