import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, Plus, X, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';

export default function DataAnggota() {
  const [anggotaList, setAnggotaList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Tanggal daftar dihapus dari state form, biarkan backend yang urus otomatis
  const [formData, setFormData] = useState({
    nama: '', alamat: '', nomor_hp: '', email: ''
  });

  const fetchAnggota = async () => {
    try {
      const response = await axios.get('http://localhost:3000/anggota/advanced');
      setAnggotaList(response.data.data);
    } catch (error) { console.error("Gagal mengambil data:", error); }
  };

  useEffect(() => { fetchAnggota(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData({ nama: '', alamat: '', nomor_hp: '', email: '' });
    setEditId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (anggota) => {
    setFormData({
      nama: anggota.nama,
      alamat: anggota.alamat,
      nomor_hp: anggota.nomor_hp,
      email: anggota.email
    });
    setEditId(anggota._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:3000/anggota/${editId}`, formData);
        Swal.fire({ title: 'Berhasil!', text: 'Data anggota diperbarui.', icon: 'success', confirmButtonColor: '#16a34a', timer: 2000 });
      } else {
        await axios.post('http://localhost:3000/anggota', formData);
        Swal.fire({ title: 'Berhasil!', text: 'Anggota baru ditambahkan.', icon: 'success', confirmButtonColor: '#16a34a', timer: 2000 });
      }
      resetForm();
      fetchAnggota();
    } catch (error) { 
      // Tampilkan error spesifik dari backend
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Terjadi kesalahan sistem.';
      Swal.fire('Gagal!', errorMsg, 'error'); 
    }
  };

  const handleDelete = (id) => {
    Swal.fire({ 
      title: 'Yakin hapus?', 
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonColor: '#d33', 
      confirmButtonText: 'Ya, Hapus!' 
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/anggota/${id}`);
          Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
          fetchAnggota();
        } catch (error) { 
          // PERBAIKAN: Tangkap pesan error asli dari backend
          const errorMsg = error.response?.data?.message || 'Terjadi kesalahan sistem.';
          Swal.fire('Gagal!', errorMsg, 'error'); 
        }
      }
    });
  };

  const filteredAnggota = anggotaList.filter((a) => 
    a.nama.toLowerCase().includes(searchTerm.toLowerCase()) || a.nomor_hp.includes(searchTerm)
  );

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">Data Anggota</h1>
          </div>
          <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors">
            <Plus className="w-5 h-5" /> Tambah Anggota
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute inset-y-0 left-3 my-auto h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Cari nama atau nomor hp..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-gray-100 text-sm">
                <th className="p-4 w-[20%] font-semibold text-gray-600">Nama Lengkap</th>
                <th className="p-4 w-[25%] font-semibold text-gray-600">Alamat</th>
                <th className="p-4 w-[15%] font-semibold text-gray-600">No. HP</th>
                <th className="p-4 w-[20%] font-semibold text-gray-600">Email</th>
                <th className="p-4 w-[10%] font-semibold text-gray-600">Tanggal Daftar</th>
                <th className="p-4 w-[10%] font-semibold text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnggota.length > 0 ? (
                filteredAnggota.map((anggota) => (
                  <tr key={anggota._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800"><div className="truncate cursor-help" title={anggota.nama}>{anggota.nama}</div></td>
                    <td className="p-4 text-gray-600"><div className="truncate cursor-help" title={anggota.alamat}>{anggota.alamat}</div></td>
                    <td className="p-4 text-gray-600 font-mono text-sm"><div className="truncate" title={anggota.nomor_hp}>{anggota.nomor_hp}</div></td>
                    <td className="p-4 text-gray-600"><div className="truncate cursor-help" title={anggota.email}>{anggota.email}</div></td>
                    <td className="p-4 text-gray-600 text-sm">
                      <div className="truncate">
                        {anggota.tanggal_daftar ? new Date(anggota.tanggal_daftar).toLocaleDateString('id-ID') : '-'}
                      </div>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      <button onClick={() => handleEdit(anggota)} title="Edit" className="cursor-pointer p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(anggota._id)} title="Hapus" className="cursor-pointer p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={resetForm} className="cursor-pointer absolute top-5 right-5 text-gray-400 bg-gray-50 p-2 rounded-full hover:text-red-500 transition-colors"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{editId ? 'Edit Data Anggota' : 'Tambah Anggota Baru'}</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input type="text" name="nama" required value={formData.nama} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Rumah</label>
                <input type="text" name="alamat" required value={formData.alamat} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP</label>
                <input type="text" name="nomor_hp" required value={formData.nomor_hp} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
              </div>
              
              {/* NOTE: Input Tanggal Daftar Sudah Resmi Dihapus dari Sini */}

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={resetForm} className="cursor-pointer px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium">Batal</button>
                <button type="submit" className="cursor-pointer px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-sm">{editId ? 'Update Anggota' : 'Simpan Anggota'}</button>
              </div>
            </form>

          </div>
        </div>
      )}
    </Layout>
  );
}