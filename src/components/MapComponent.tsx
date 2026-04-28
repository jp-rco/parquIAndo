import { APIProvider, Map as GoogleMap, Marker } from '@vis.gl/react-google-maps';
import type { ParkingLot } from '../data/mockData';
import { MapPin, Navigation } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  parkingLots: ParkingLot[];
  selectedParking: ParkingLot | null;
  onSelectParking: (parking: ParkingLot) => void;
  destinationName: string;
}

export default function MapComponent({ parkingLots, selectedParking, onSelectParking, destinationName }: Props) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const center = { lat: 4.8615, lng: -74.0315 }; 

  if (!apiKey) {
    return (
      <div className="w-full h-full bg-[#E8EAED] relative overflow-hidden">
        {/* Grilla de calles minimalista */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute bg-slate-400" style={{ left: `${i * 10}%`, top: 0, bottom: 0, width: '1px' }} />
          ))}
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute bg-slate-400" style={{ top: `${i * 10}%`, left: 0, right: 0, height: '1px' }} />
          ))}
        </div>
        
        {/* Calles principales */}
        <div className="absolute top-[45%] left-0 right-0 h-8 bg-white shadow-sm border-y border-slate-200 transform -rotate-2"></div>
        <div className="absolute top-0 bottom-0 left-[35%] w-10 bg-white shadow-sm border-x border-slate-200 transform rotate-1"></div>
        
        {/* Ruta Simulada (si hay destino) */}
        {destinationName && (
           <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
             <path 
               d="M 50 100 Q 50 70, 35 45 L 35 0" 
               fill="none" 
               stroke="#10b981" 
               strokeWidth="8" 
               strokeLinecap="round" 
               strokeDasharray="1 15"
               className="animate-[dash_20s_linear_infinite]"
             />
           </svg>
        )}

        {/* Marcador de destino */}
        {destinationName && (
          <div className="absolute top-[45%] left-[35%] transform -translate-x-1/2 -translate-y-1/2 z-10">
             <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                <MapPin className="h-10 w-10 text-blue-600 drop-shadow-xl" fill="currentColor" />
             </div>
             <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-2xl whitespace-nowrap mt-2 block border border-white/20">
               {destinationName}
             </span>
          </div>
        )}

        {/* Marcador de Usuario (Waze style) */}
        {!destinationName && (
           <div className="absolute bottom-[20%] left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
              <div className="h-10 w-10 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-emerald-500">
                <Navigation className="h-5 w-5 text-emerald-600 fill-current" />
              </div>
           </div>
        )}

        {/* Marcadores de parqueaderos */}
        {parkingLots.map((p) => {
          const top = p.id === 'A' ? '30%' : p.id === 'B' ? '55%' : '70%';
          const left = p.id === 'A' ? '50%' : p.id === 'B' ? '28%' : '45%';
          const isSelected = selectedParking?.id === p.id;

          return (
            <button
              key={p.id}
              onClick={() => onSelectParking(p)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group transition-all"
              style={{ top, left }}
            >
              <div className={clsx(
                "h-10 w-10 rounded-2xl flex items-center justify-center font-black text-xs shadow-2xl transition-all border-2",
                p.recommended 
                  ? "bg-emerald-500 border-white text-white z-30 ring-8 ring-emerald-500/20 scale-110" 
                  : isSelected ? "bg-slate-900 border-white text-white scale-125 z-40" : "bg-white border-slate-200 text-slate-800"
              )}>
                P
              </div>
              {isSelected && (
                 <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-2xl whitespace-nowrap z-50 border border-white/10">
                   {p.name}
                 </div>
              )}
            </button>
          )
        })}

        <div className="absolute bottom-6 right-6 bg-white/50 backdrop-blur-md p-2 rounded-lg text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
          Simulación de Navegación
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="w-full h-full overflow-hidden">
        <GoogleMap defaultCenter={center} defaultZoom={15} disableDefaultUI={true}>
          {/* Destino */}
          {destinationName && <Marker position={center} title={destinationName} />}
          
          {/* Parqueaderos */}
          {parkingLots.map(p => (
            <Marker 
              key={p.id} 
              position={{lat: p.lat, lng: p.lng}}
              onClick={() => onSelectParking(p)}
              label={{ text: 'P', color: 'white', fontWeight: 'bold' }}
              title={p.name}
            />
          ))}
        </GoogleMap>
      </div>
    </APIProvider>
  );
}
