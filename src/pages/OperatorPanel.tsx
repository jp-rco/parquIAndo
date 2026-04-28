import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, TrendingUp, AlertTriangle, Users, Clock, BrainCircuit, ArrowUpRight, 
  ArrowLeft, Car, Camera, Video, AlertCircle, CheckCircle2, ChevronDown, DollarSign,
  Activity, Bell, Calendar, Map, Navigation2, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { 
  PARKINGS, getParkingStats, DEMAND_FORECAST, HOURLY_HISTORY, 
  AI_RECOMMENDATIONS, ALERTS
} from '../data/operatorData';
import type { ParkingData, ZoneData } from '../data/operatorData';

// ── Components ──

function KPICard({ title, value, subtitle, trend, isPositive, icon, color = 'emerald' }: any) {
  return (
    <motion.div whileHover={{ y: -2 }} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-3">
        <p className={`text-[10px] font-bold text-slate-500 uppercase tracking-wider`}>{title}</p>
        <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600 border border-${color}-100`}>{icon}</div>
      </div>
      <div className="flex items-end gap-2">
        <h4 className="text-2xl font-black text-slate-800">{value}</h4>
        {subtitle && <span className="text-xs font-medium text-slate-500 mb-1">{subtitle}</span>}
      </div>
      {trend && (
        <div className={clsx('flex items-center gap-1 mt-2 text-[10px] font-bold',
          isPositive === true ? 'text-emerald-600' : isPositive === false ? 'text-rose-600' : 'text-slate-500'
        )}>
          {isPositive !== undefined && <ArrowUpRight className={clsx('h-3 w-3', !isPositive && 'rotate-90')} />}
          {trend}
        </div>
      )}
    </motion.div>
  );
}

function Slot3D({ id, occupied, delay }: { id: string; occupied: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.2 }}
      className="relative group cursor-pointer"
    >
      <div className={clsx(
        'w-full aspect-[2/3] rounded flex flex-col items-center justify-center select-none transition-all duration-200 border-b-2',
        occupied 
          ? 'bg-rose-400 border-rose-600 shadow-[0_2px_0_#be123c]' 
          : 'bg-emerald-400 border-emerald-600 shadow-[0_2px_0_#059669]'
      )}>
        {occupied ? <Car className="h-3 w-3 text-rose-900 opacity-60" /> : <div className="h-1.5 w-1.5 rounded-full bg-emerald-900 opacity-40" />}
        <span className={clsx("text-[6px] font-black mt-0.5", occupied ? 'text-rose-900' : 'text-emerald-900')}>{id.split('-')[1]}</span>
      </div>
    </motion.div>
  );
}

function ZoneMap({ zone }: { zone: ZoneData }) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h4 className="font-bold text-slate-700 text-sm">{zone.name}</h4>
          <p className="text-[10px] text-slate-500">{zone.slots.filter(s=>s.occupied).length}/{zone.capacity} ocupados</p>
        </div>
        <div className={clsx("px-2 py-1 rounded text-[9px] font-bold uppercase", 
          zone.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 
          zone.color === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
        )}>
          {zone.color === 'emerald' ? 'Libre' : zone.color === 'amber' ? 'Media' : 'Alta'}
        </div>
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
        {zone.slots.map((s, i) => <Slot3D key={s.id} id={s.id} occupied={s.occupied} delay={i * 0.01} />)}
      </div>
    </div>
  );
}

// ── Main Page ──

export default function OperatorPanel() {
  const navigate = useNavigate();
  const [activeParkingId, setActiveParkingId] = useState(PARKINGS[0].id);
  
  const parking = PARKINGS.find(p => p.id === activeParkingId)!;
  const stats = getParkingStats(parking);

  return (
    <div className="flex-1 bg-[#f8fafc] overflow-y-auto h-full text-slate-800 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-6 pb-20">
        
        {/* Header & Selector */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Centro de Control Operativo</h1>
              <p className="text-slate-500 text-xs font-medium mt-0.5">Gestión Inteligente de Movilidad</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live
            </div>
            <div className="relative flex-1 md:w-48">
              <select 
                className="w-full appearance-none bg-slate-100 border border-slate-200 text-slate-800 font-bold py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={activeParkingId}
                onChange={(e) => setActiveParkingId(e.target.value)}
              >
                {PARKINGS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* AI Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-5 md:p-6 shadow-lg text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
            <BrainCircuit className="h-64 w-64" />
          </div>
          <div className="bg-blue-500/20 p-4 rounded-full backdrop-blur-md shrink-0">
            <BrainCircuit className="h-8 w-8 text-blue-200" />
          </div>
          <div className="flex-1 relative z-10">
            <div className="text-blue-300 font-bold text-[10px] tracking-widest uppercase mb-1">IA Insights · Tiempo Real</div>
            <p className="text-lg font-medium leading-snug">
              {AI_RECOMMENDATIONS[0].text}
            </p>
          </div>
          <div className="shrink-0 relative z-10">
            <button className="bg-white text-blue-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/50">
              Ejecutar Acción
            </button>
          </div>
        </div>

        {/* Main KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard title="Ocupación" value={`${stats.occupancy}%`} subtitle={`${stats.totalOcc}/${stats.totalCap} cupos`} trend="+2.4% vs ayer" isPositive={false} icon={<BarChart3 className="h-4 w-4" />} color="blue" />
          <KPICard title="Ingresos Hoy" value={`$${(stats.totalRevenue/1000000).toFixed(1)}M`} subtitle="Estimado" trend="+12% vs prom." isPositive={true} icon={<DollarSign className="h-4 w-4" />} color="emerald" />
          <KPICard title="Rotación Prom." value={stats.avgRotation} subtitle="veh/hora" trend="+3 veh/h" isPositive={true} icon={<Users className="h-4 w-4" />} color="indigo" />
          <KPICard title="Permanencia" value={`${stats.avgStay}h`} subtitle="promedio" trend="-0.4h vs ayer" isPositive={true} icon={<Clock className="h-4 w-4" />} color="amber" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Map & Zones */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live Map */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2"><Map className="h-5 w-5 text-blue-500"/> Mapa de Ocupación por Zonas</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Monitor en tiempo real de {parking.name}</p>
                </div>
                <div className="flex gap-3 text-[10px] font-bold uppercase">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Libre</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"/> Media</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"/> Alta</div>
                </div>
              </div>
              <div className="p-5 flex-1 bg-slate-50/50">
                <div className="grid grid-cols-1 gap-4">
                  {parking.zones.map(z => <ZoneMap key={z.id} zone={z} />)}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: AI, Alerts, Controls */}
          <div className="space-y-6">
            
            {/* Realtime Alerts */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-base font-bold flex items-center gap-2 mb-4"><Bell className="h-4 w-4 text-amber-500"/> Alertas Activas</h3>
              <div className="space-y-3">
                {ALERTS.slice(0,3).map((alert, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="shrink-0 mt-0.5">
                      {alert.type === 'danger' ? <AlertCircle className="h-4 w-4 text-rose-500" /> :
                       alert.type === 'warning' ? <AlertTriangle className="h-4 w-4 text-amber-500" /> :
                       <div className="h-4 w-4 text-blue-500"><Zap className="h-4 w-4" /></div>}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700 leading-snug">{alert.text}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cameras & Sensors */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-base font-bold flex items-center gap-2 mb-4"><Video className="h-4 w-4 text-slate-600"/> Sensores y Cámaras</h3>
              <div className="space-y-3 mb-4">
                {parking.cameras.map((c, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-600 flex items-center gap-2">
                      <Camera className="h-3 w-3 text-slate-400"/> {c.name}
                    </span>
                    <span className={clsx("text-[9px] font-bold uppercase px-2 py-0.5 rounded-full",
                      c.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      c.status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    )}>
                      {c.status === 'active' ? 'Normal' : c.status === 'warning' ? 'Baja Vis.' : 'Offline'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Precisión IA</p>
                  <p className="text-sm font-black text-slate-800">{parking.detectionAccuracy}%</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Sincronización</p>
                  <p className="text-sm font-black text-slate-800">-{parking.lastSync}s</p>
                </div>
              </div>
            </div>

            {/* Action Panel */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-base font-bold flex items-center gap-2 mb-4"><Navigation2 className="h-4 w-4 text-indigo-500"/> Control Operativo</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-700 transition-colors flex justify-between items-center">
                  Activar señalización dinámica <ArrowUpRight className="h-3 w-3 opacity-50" />
                </button>
                <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-200 rounded-xl text-xs font-bold text-slate-700 hover:text-rose-700 transition-colors flex justify-between items-center">
                  Cerrar zona temporalmente <ArrowUpRight className="h-3 w-3 opacity-50" />
                </button>
                <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-200 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-700 transition-colors flex justify-between items-center">
                  Marcar mantenimiento <ArrowUpRight className="h-3 w-3 opacity-50" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Row: Charts & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* History Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold flex items-center gap-2"><Calendar className="h-4 w-4 text-indigo-500"/> Historial (Hoy)</h3>
              <span className="text-[10px] font-bold uppercase text-slate-400">Patrón IA</span>
            </div>
            <div className="h-40 flex items-end justify-between gap-1 px-1">
              {HOURLY_HISTORY.map((d, i) => (
                <div key={i} className="flex flex-col items-center flex-1 group">
                  <span className="text-[8px] font-bold text-slate-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{d.occ}%</span>
                  <div className="w-full bg-slate-100 rounded-t-sm relative overflow-hidden h-24 group-hover:bg-indigo-50 transition-colors">
                    <motion.div 
                      initial={{ height: 0 }} animate={{ height: `${d.occ}%` }} transition={{ delay: i*0.05 }}
                      className="absolute bottom-0 left-0 right-0 bg-indigo-300 rounded-t-sm opacity-80 group-hover:opacity-100 group-hover:bg-indigo-400 transition-colors"
                    />
                  </div>
                  <span className="text-[8px] font-medium text-slate-400 mt-1 whitespace-nowrap">{d.hour}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Demand Prediction */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-500"/> Predicción de Demanda (2h)</h3>
              <span className="text-[10px] font-bold uppercase text-slate-400">Modelo IA V4</span>
            </div>
            <div className="h-40 flex items-end justify-between gap-2 px-2">
              {DEMAND_FORECAST.map((d, i) => (
                <div key={i} className="flex flex-col items-center flex-1 group">
                  <span className="text-[10px] font-bold text-slate-600 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{d.occ}%</span>
                  <div className="w-full bg-slate-100 rounded-t-md relative overflow-hidden h-24">
                    <motion.div 
                      initial={{ height: 0 }} animate={{ height: `${d.occ}%` }} transition={{ delay: i*0.1 }}
                      className={clsx("absolute bottom-0 left-0 right-0 rounded-t-md opacity-80 transition-all group-hover:opacity-100", 
                        d.occ > 80 ? 'bg-rose-400' : d.occ > 60 ? 'bg-amber-400' : 'bg-emerald-400'
                      )} 
                    />
                  </div>
                  <span className="text-[9px] font-medium text-slate-400 mt-2 whitespace-nowrap">{d.hour}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Analytics */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2 mb-4"><Activity className="h-4 w-4 text-blue-500"/> Análisis Comercial</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Ingresos Perdidos (Saturación)</p>
                    <p className="text-lg font-black text-rose-600">-$125,000 <span className="text-[10px] font-medium text-rose-400">est. hoy</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Ticket Promedio</p>
                    <p className="text-lg font-black text-slate-800">$8,450</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex gap-2 items-start">
                    <Zap className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-blue-800">Oportunidad de Optimización</p>
                      <p className="text-[10px] text-blue-600 mt-1 leading-relaxed">
                        Aumentar la rotación en {parking.name} en un 15% guiando usuarios a zonas libres puede generar <span className="font-bold">+$450,000</span> adicionales diarios.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
