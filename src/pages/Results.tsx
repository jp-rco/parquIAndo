import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAIParkingRecommendation } from '../data/mockData';
import type { ParkingLot } from '../data/mockData';
import MapComponent from '../components/MapComponent';
import { BrainCircuit, Navigation, ArrowLeft, MoreHorizontal, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const destination = searchParams.get('dest') || 'Destino desconocido';
  
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ParkingLot[]>([]);
  const [selected, setSelected] = useState<ParkingLot | null>(null);

  useEffect(() => {
    getAIParkingRecommendation(destination).then(data => {
      setResults(data);
      const recommended = data.find(p => p.recommended) || data[0];
      setSelected(recommended);
      setTimeout(() => setLoading(false), 2000);
    });
  }, [destination]);

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-900 text-white p-6">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <BrainCircuit className="h-16 w-16 text-emerald-400" />
        </motion.div>
        <h2 className="text-2xl font-black tracking-tight mb-2">Calculando ruta inteligente</h2>
        <p className="text-slate-400 text-center animate-pulse">Analizando ocupación y demanda con IA...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative overflow-hidden bg-slate-200">
      {/* Mapa de Navegación de Fondo */}
      <div className="absolute inset-0 z-0">
        <MapComponent 
          parkingLots={results} 
          selectedParking={selected} 
          onSelectParking={setSelected}
          destinationName={destination}
        />
      </div>

      {/* Overlays de Navegación */}
      <div className="absolute inset-0 z-10 pointer-events-none p-4 md:p-6 flex flex-col justify-between">
        {/* Superior: Info de Destino y Botón Volver */}
        <div className="flex justify-between items-start pt-2">
          <motion.button 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => navigate('/')}
            className="pointer-events-auto bg-white rounded-full p-4 shadow-xl hover:bg-slate-50 transition-colors border border-slate-100"
          >
            <ArrowLeft className="h-6 w-6 text-slate-700" />
          </motion.button>

          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/90 backdrop-blur-xl px-6 py-4 rounded-3xl shadow-xl border border-white/20 text-center max-w-xs md:max-w-md pointer-events-auto"
          >
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Destino</h3>
            <p className="text-lg font-black text-slate-900 truncate">{destination}</p>
          </motion.div>

          <div className="w-12 h-12 lg:opacity-0" /> {/* Spacer */}
        </div>

        {/* Inferior: Selector de Parqueaderos (Horizontal Estilo App) */}
        <div className="w-full flex flex-col gap-4">
          <div className="overflow-x-auto custom-scrollbar-none pb-2 flex gap-4 pointer-events-auto px-2">
            {results.map((parking) => (
              <motion.button
                key={parking.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelected(parking)}
                className={clsx(
                  "flex-shrink-0 w-72 p-4 rounded-3xl transition-all shadow-2xl border-2 text-left relative overflow-hidden",
                  selected?.id === parking.id 
                    ? "bg-white border-emerald-500 ring-4 ring-emerald-500/10" 
                    : "bg-white/80 backdrop-blur-md border-transparent grayscale-[0.5] opacity-80"
                )}
              >
                {parking.recommended && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-tighter">
                    Recomendado IA
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-black text-slate-800">{parking.name}</h4>
                  <span className={clsx(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                    parking.risk === 'Bajo' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                    parking.risk === 'Alto' ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-amber-50 border-amber-100 text-amber-600"
                  )}>
                    {parking.eta}
                  </span>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Ocupación</p>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={clsx("h-full rounded-full", parking.occupancy > 85 ? "bg-rose-500" : parking.occupancy > 70 ? "bg-amber-500" : "bg-emerald-500")} 
                          style={{ width: `${parking.occupancy}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-slate-700">{parking.occupancy}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Libres</p>
                     <span className="text-sm font-black text-slate-800">{parking.availableSpaces}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Botón de Acción Principal para el Seleccionado */}
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div 
                key={selected.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="pointer-events-auto"
              >
                <div className="bg-white rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] p-6 md:p-8 border-t border-slate-100 max-w-2xl mx-auto">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-900 text-white p-3 rounded-2xl">
                        <Navigation className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900">{selected.name}</h4>
                        <p className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                          <BrainCircuit className="h-4 w-4" /> {selected.aiMessage}
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-slate-500">
                      <MoreHorizontal className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Probabilidad de Cupo</p>
                      <p className="text-lg font-black text-slate-800">Alta</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Costo Estimado</p>
                      <p className="text-lg font-black text-slate-800">$4.500 <span className="text-xs text-slate-400">/h</span></p>
                    </div>
                  </div>

                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-[24px] font-black text-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-200 active:scale-95"
                  >
                    Ir ahora
                    <Navigation className="h-6 w-6" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
