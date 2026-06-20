import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Library, BookOpen, Users, ArrowLeftRight, LogOut, Menu } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  // State untuk mengontrol buka-tutup sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    Swal.fire({
      title: 'Yakin ingin keluar?',
      text: 'Anda harus login kembali untuk masuk.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Keluar!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate('/');
      }
    });
  };

  const menuItems = [
    { path: '/databuku', name: 'Data Buku', icon: <BookOpen className="w-5 h-5" /> },
    { path: '/anggota', name: 'Data Anggota', icon: <Users className="w-5 h-5" /> },
    { path: '/peminjaman', name: 'Peminjaman', icon: <ArrowLeftRight className="w-5 h-5" /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out z-20`}
      >
        {/* Header Logo & Toggle */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
            <Library className="w-7 h-7 text-blue-600 shrink-0" />
            <span className="text-xl font-bold text-gray-800 tracking-tight whitespace-nowrap">PerpusAdmin</span>
          </div>
          {/* Tombol Hamburger */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 -mr-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 py-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path}
                title={!isSidebarOpen ? item.name : ""}
                className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group
                  ${isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}
                  ${!isSidebarOpen && 'justify-center'}
                `}
              >
                <div className={`${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'} transition-colors`}>
                  {item.icon}
                </div>
                <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto block' : 'opacity-0 w-0 hidden'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Tombol Logout */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            title={!isSidebarOpen ? "Keluar" : ""}
            className={`flex items-center w-full px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut className="w-5 h-5" />
            <span className={`ml-3 font-medium whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto block' : 'opacity-0 w-0 hidden'}`}>
              Keluar
            </span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 h-screen overflow-y-auto transition-all duration-300 ease-in-out">
        {children}
      </main>
      
    </div>
  );
}