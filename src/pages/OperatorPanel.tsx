import { BarChart3, TrendingUp, AlertTriangle, Users, Clock, BrainCircuit, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
}

interface ParkingBarProps {
  name: string;
  occupancy: number;
  capacity: number;
  status: string;
  color: string;
}

export default function OperatorPanel() {
  return (
    <div className="flex-1 bg-slate-50 p-4 md:p-8 overflow-y-auto h-full">
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800">Panel Operador Inteligente</h1>
            <p className="text-slate-500 mt-1">Monitoreo en tiempo real impulsado por IA</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-xl font-medium text-sm">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
             Sistema Conectado (Simulación)
          </div>
        </div>

        {/* Recomendación IA Global */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 shadow-xl text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <BrainCircuit className="h-48 w-48" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-3 uppercase tracking-wider text-sm">
              <BrainCircuit className="h-5 w-5" />
              Recomendación IA Inmediata
            </div>
            <p className="text-xl md:text-2xl font-light text-slate-200 leading-relaxed max-w-3xl">
              "Activar señalización hacia <span className="font-bold text-white border-b-2 border-emerald-500">Parqueadero B</span> y redirigir flujo desde <span className="font-bold text-white border-b-2 border-rose-500">Parqueadero A</span> para evitar embotellamiento en los próximos 15 minutos."
            </p>
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Ocupación Promedio" value="76%" trend="+5.2%" isPositive={false} icon={<BarChart3 />} />
          <KPICard title="Rotación Estimada" value="18" subtitle="vehículos/hora" trend="+2" isPositive={true} icon={<Users />} />
          <KPICard title="Hora Crítica IA" value="7:30 - 9:00" subtitle="a.m." icon={<Clock />} />
          <KPICard title="Riesgo de Saturación" value="Medio" icon={<AlertTriangle className="text-amber-500" />} />
        </div>

        {/* Gráficas / Estado detallado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
             <h3 className="text-lg font-bold text-slate-800 mb-6">Estado Actual por Parqueadero</h3>
             
             <div className="space-y-6">
               <ParkingBar name="Parqueadero A" occupancy={92} capacity={50} status="Saturado" color="bg-rose-500" />
               <ParkingBar name="Parqueadero B" occupancy={60} capacity={60} status="Óptimo" color="bg-emerald-500" />
               <ParkingBar name="Parqueadero C" occupancy={78} capacity={55} status="Precaución" color="bg-amber-500" />
             </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col">
             <h3 className="text-lg font-bold text-slate-800 mb-4">Rendimiento</h3>
             <div className="flex-1 flex flex-col justify-center items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-10 w-10 text-emerald-600" />
                </div>
                <h4 className="font-bold text-slate-700">Parqueadero con mejor rendimiento</h4>
                <p className="text-2xl font-extrabold text-slate-900 mt-2">Parqueadero B</p>
                <p className="text-sm text-slate-500 mt-2">Mayor rotación y mejor distribución de demanda en la última hora.</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function KPICard({ title, value, subtitle, trend, isPositive, icon }: KPICardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="text-slate-400 bg-slate-50 p-2 rounded-lg">{icon}</div>
      </div>
      <div className="flex items-end gap-2">
        <h4 className="text-3xl font-bold text-slate-800">{value}</h4>
        {subtitle && <span className="text-sm font-medium text-slate-500 mb-1">{subtitle}</span>}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${isPositive === true ? 'text-emerald-600' : isPositive === false ? 'text-rose-600' : 'text-slate-500'}`}>
          {isPositive === true ? <ArrowUpRight className="h-4 w-4" /> : isPositive === false ? <ArrowUpRight className="h-4 w-4" /> : null}
          {trend} respecto a ayer
        </div>
      )}
    </motion.div>
  );
}

function ParkingBar({ name, occupancy, capacity, status, color }: ParkingBarProps) {
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <div>
          <span className="font-bold text-slate-800">{name}</span>
          <span className="text-xs font-medium text-slate-500 ml-2">({Math.round((occupancy/100)*capacity)}/{capacity} cupos)</span>
        </div>
        <div className="text-sm font-bold text-slate-700">{occupancy}% - {status}</div>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${occupancy}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  )
}
