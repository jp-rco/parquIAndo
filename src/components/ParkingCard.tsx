import type { ParkingLot } from '../data/mockData';
import { Car, Zap, Map as MapIcon, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface Props {
  parking: ParkingLot;
  isSelected: boolean;
  onClick: () => void;
}

export default function ParkingCard({ parking, isSelected, onClick }: Props) {
  const isRecommended = parking.recommended;
  
  const getStatusColor = (risk: string) => {
    switch(risk) {
      case 'Bajo': return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      case 'Medio': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'Alto': return 'text-rose-600 bg-rose-100 border-rose-200';
      default: return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const getProgressColor = (occupancy: number) => {
    if (occupancy < 70) return 'bg-emerald-500';
    if (occupancy < 85) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={clsx(
        "relative p-5 rounded-2xl cursor-pointer transition-all border-2 text-left w-full",
        isSelected 
          ? isRecommended ? "border-emerald-500 shadow-emerald-100 shadow-lg bg-white" : "border-slate-800 shadow-lg bg-white" 
          : "border-slate-100 bg-white/80 hover:bg-white hover:border-slate-300 hover:shadow-md"
      )}
    >
      {isRecommended && (
        <div className="absolute -top-3 right-4 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
          <Zap className="h-3 w-3" fill="currentColor" />
          Recomendado por IA
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-slate-800">{parking.name}</h3>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
            <MapIcon className="h-3 w-3" /> A {parking.eta} de tu destino
          </p>
        </div>
        <div className={clsx("px-2.5 py-1 rounded-lg text-xs font-semibold border", getStatusColor(parking.risk))}>
          {parking.status}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-medium text-slate-700 flex items-center gap-1">
            <Car className="h-4 w-4 text-slate-400" /> {parking.occupancy}% ocupado
          </span>
          <span className="font-bold text-slate-800">{parking.availableSpaces} cupos</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div 
            className={clsx("h-2 rounded-full", getProgressColor(parking.occupancy))}
            style={{ width: `${parking.occupancy}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-sm">
        <p className="text-slate-700 italic">
          <span className="font-semibold not-italic">Mensaje IA: </span>
          "{parking.aiMessage}"
        </p>
      </div>

      {isSelected && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between"
        >
          <div className="text-sm">
            <p className="text-slate-500">Predicción: <span className="font-medium text-slate-800">{parking.prediction || 'N/A'}</span></p>
            <p className="text-slate-500">Posible espera: <span className="font-medium text-slate-800">{parking.waitTime}</span></p>
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
             <ChevronRight className="h-5 w-5" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
