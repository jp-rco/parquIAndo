import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, Settings, Mic, CarFront } from 'lucide-react';
import { motion } from 'framer-motion';
import MapComponent from '../components/MapComponent';
import { parkingLots } from '../data/mockData';

export default function Home() {
  const [destination, setDestination] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    navigate(`/results?dest=${encodeURIComponent(destination)}`);
  };

  return (
    <div className="h-full w-full relative overflow-hidden bg-slate-200">
      {/* Mapa de Fondo (Simulado) */}
      <div className="absolute inset-0 z-0">
        <MapComponent 
          parkingLots={[]} 
          selectedParking={null} 
          onSelectParking={() => {}} 
          destinationName=""
        />
      </div>

      {/* Interfaz Flotante Estilo Waze */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 md:p-6">
        {/* Superior: Barra de Búsqueda Minimalista */}
        <div className="w-full flex justify-center items-start pt-2">
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-xl pointer-events-auto"
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-2 flex items-center gap-3">
              <button className="p-3 text-slate-500 hover:text-slate-800 transition-colors">
                <Menu className="h-6 w-6" />
              </button>
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="¿A dónde vas?" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-100/50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-800 placeholder:text-slate-400"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </form>
              <button className="p-3 text-slate-500 hover:text-slate-800 transition-colors">
                <Mic className="h-6 w-6" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Inferior: Acciones rápidas y Branding */}
        <div className="w-full flex flex-col items-center gap-4">
          {/* Logo Minimalista Flotante */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 pointer-events-auto cursor-default"
          >
            <CarFront className="h-5 w-5" />
            <span className="font-black tracking-tighter">parqu<span className="italic">IA</span>ndo</span>
          </motion.div>

          {/* Tarjeta de Inicio Rápido */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 pointer-events-auto border border-slate-100"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-4">¡Hola! 👋</h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/results?dest=Universidad%20de%20La%20Sabana')}
                className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl transition-colors group border border-transparent hover:border-emerald-100"
              >
                <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <CarFront className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold text-slate-700">La Sabana</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors border border-transparent">
                <div className="h-12 w-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-600">
                  <Settings className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold text-slate-700">Configurar</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
