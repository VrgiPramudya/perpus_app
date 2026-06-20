import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Library, KeyRound, User, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2'; 

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pesanError, setPesanError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setPesanError(''); 

    try {
      const response = await axios.post('http://localhost:3000/petugas/login', {
        username: username,
        password: password
      });

      // --- TAMBAHAN BARU: Simpan ID Petugas ke memori browser ---
      localStorage.setItem('id_petugas', response.data.data._id);
      localStorage.setItem('nama_petugas', response.data.data.nama_petugas);

      Swal.fire({
        title: 'Berhasil Login!',
        text: response.data.message,
        icon: 'success',
        confirmButtonColor: '#2563eb',
        timer: 2000 
      }).then(() => {
        navigate('/databuku');
      });

    } catch (error) {
      if (error.response) {
        setPesanError(error.response.data.message);
      } else {
        setPesanError('Waduh, tidak bisa terhubung ke server.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full mb-3">
            <Library className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">PerpusAdmin</h1>
          <p className="text-slate-500 text-sm">Masuk khusus petugas perpustakaan</p>
        </div>

        {pesanError && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 border border-red-200 rounded-lg text-sm text-center">
            {pesanError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input type="text" required className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Masukkan username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-slate-400" />
              </div>
              <input type={showPassword ? "text" : "password"} required className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button type="submit" className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200">
            Masuk ke Sistem
          </button>
        </form>
      </div>
    </div>
  );
}