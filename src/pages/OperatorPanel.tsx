import { BarChart3, TrendingUp, AlertTriangle, Users, Clock, BrainCircuit, ArrowUpRight, ArrowLeft, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

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

// Data: 60 slots con patrón realista de ocupación
const SLOT_ROWS = [
  // Fila A (izq) - mayormente libre
  [
    { id: 'A01', occupied: false }, { id: 'A02', occupied: true  }, { id: 'A03', occupied: false },
    { id: 'A04', occupied: true  }, { id: 'A05', occupied: false }, { id: 'A06', occupied: true  },
    { id: 'A07', occupied: false }, { id: 'A08', occupied: false }, { id: 'A09', occupied: true  },
    { id: 'A10', occupied: false }, { id: 'A11', occupied: true  }, { id: 'A12', occupied: false },
  ],
  // Fila B - mixta
  [
    { id: 'B01', occupied: true  }, { id: 'B02', occupied: true  }, { id: 'B03', occupied: false },
    { id: 'B04', occupied: false }, { id: 'B05', occupied: true  }, { id: 'B06', occupied: false },
    { id: 'B07', occupied: true  }, { id: 'B08', occupied: true  }, { id: 'B09', occupied: false },
    { id: 'B10', occupied: true  }, { id: 'B11', occupied: false }, { id: 'B12', occupied: true  },
  ],
  // Fila C - casi llena
  [
    { id: 'C01', occupied: true  }, { id: 'C02', occupied: true  }, { id: 'C03', occupied: true  },
    { id: 'C04', occupied: false }, { id: 'C05', occupied: true  }, { id: 'C06', occupied: true  },
    { id: 'C07', occupied: true  }, { id: 'C08', occupied: false }, { id: 'C09', occupied: true  },
    { id: 'C10', occupied: true  }, { id: 'C11', occupied: true  }, { id: 'C12', occupied: false },
  ],
  // Fila D - muy ocupada
  [
    { id: 'D01', occupied: true  }, { id: 'D02', occupied: true  }, { id: 'D03', occupied: true  },
    { id: 'D04', occupied: true  }, { id: 'D05', occupied: false }, { id: 'D06', occupied: true  },
    { id: 'D07', occupied: true  }, { id: 'D08', occupied: true  }, { id: 'D09', occupied: true  },
    { id: 'D10', occupied: false }, { id: 'D11', occupied: true  }, { id: 'D12', occupied: true  },
  ],
  // Fila E - mixta
  [
    { id: 'E01', occupied: false }, { id: 'E02', occupied: true  }, { id: 'E03', occupied: false },
    { id: 'E04', occupied: false }, { id: 'E05', occupied: true  }, { id: 'E06', occupied: false },
    { id: 'E07', occupied: false }, { id: 'E08', occupied: true  }, { id: 'E09', occupied: false },
    { id: 'E10', occupied: true  }, { id: 'E11', occupied: false }, { id: 'E12', occupied: false },
  ],
];

const allSlots = SLOT_ROWS.flat();
const available = allSlots.filter(s => !s.occupied).length;
const occupied = allSlots.filter(s => s.occupied).length;

function Slot3D({ id, occupied, delay }: { id: string; occupied: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.08, y: -3 }}
      className="relative group cursor-pointer"
      style={{ perspective: '200px' }}
    >
      {/* Slot body — el "cuadrito" principal */}
      <div
        className={clsx(
          'relative w-full rounded-xl flex flex-col items-center justify-center py-2.5 select-none',
          'transition-all duration-200 border-b-4',
          occupied
            ? 'bg-rose-400 border-rose-600 shadow-[0_6px_0_#be123c,0_8px_12px_rgba(244,63,94,0.4)]'
            : 'bg-emerald-400 border-emerald-600 shadow-[0_6px_0_#059669,0_8px_12px_rgba(16,185,129,0.4)]',
          'group-hover:border-b-2 group-hover:translate-y-[2px]'
        )}
      >
        {/* Reflejo brillante interior */}
        <div
          className={clsx(
            'absolute top-1 left-1 right-1 h-3 rounded-t-lg opacity-40',
            occupied ? 'bg-rose-200' : 'bg-emerald-200'
          )}
        />

        {/* Icono del estado */}
        <div className="relative z-10 mb-0.5">
          {occupied ? (
            <Car className="h-4 w-4 text-rose-800 opacity-70" />
          ) : (
            <div className="h-2 w-2 rounded-full bg-emerald-700 opacity-60" />
          )}
        </div>

        {/* ID del slot */}
        <span
          className={clsx(
            'relative z-10 text-[9px] font-black tracking-tight',
            occupied ? 'text-rose-800' : 'text-emerald-800'
          )}
        >
          {id}
        </span>
      </div>

      {/* Tooltip en hover */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
        {occupied ? 'Ocupado' : 'Disponible'}
      </div>
    </motion.div>
  );
}

export default function OperatorPanel() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto h-full">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6 pb-16">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-white hover:bg-slate-100 rounded-full shadow-sm transition-colors border border-slate-200"
            >
              <ArrowLeft className="h-6 w-6 text-slate-700" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800">Panel Operador</h1>
              <p className="text-slate-500 text-sm mt-0.5">Monitoreo en tiempo real — U. La Sabana</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-xl font-semibold text-sm border border-emerald-200">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Sistema Activo (Simulación)
          </div>
        </div>

        {/* Recomendación IA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 md:p-8 shadow-xl text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.15),_transparent_60%)]" />
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <BrainCircuit className="h-52 w-52" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-3 uppercase tracking-wider text-xs">
              <BrainCircuit className="h-4 w-4" />
              Recomendación IA — ahora
            </div>
            <p className="text-lg md:text-xl font-light text-slate-200 leading-relaxed max-w-3xl">
              "Activar señalización hacia{' '}
              <span className="font-bold text-white border-b-2 border-emerald-500">Parqueadero B</span>{' '}
              y redirigir flujo desde{' '}
              <span className="font-bold text-white border-b-2 border-rose-500">Parqueadero A</span>{' '}
              para evitar saturación en los próximos 15 minutos."
            </p>
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Ocupación Global" value="76%" trend="+5.2%" isPositive={false} icon={<BarChart3 className="h-5 w-5" />} />
          <KPICard title="Rotación" value="18" subtitle="veh/hora" trend="+2" isPositive={true} icon={<Users className="h-5 w-5" />} />
          <KPICard title="Hora Pico IA" value="7:30–9:00" subtitle="a.m." icon={<Clock className="h-5 w-5" />} />
          <KPICard title="Riesgo" value="Medio" icon={<AlertTriangle className="h-5 w-5 text-amber-500" />} />
        </div>

        {/* === MAPA DE SLOTS 3D EN VIVO === */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md overflow-hidden">
          {/* Cabecera del mapa */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-800">Mapa de Slots — En Vivo</h3>
              <p className="text-sm text-slate-500 mt-0.5">Parqueadero B · Universidad de La Sabana</p>
            </div>
            <div className="flex items-center gap-6 text-sm font-bold shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-md bg-emerald-400 border-b-2 border-emerald-600 shadow-[0_3px_0_#059669]" />
                <span className="text-slate-600">Libre <span className="text-emerald-700">{available}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-md bg-rose-400 border-b-2 border-rose-600 shadow-[0_3px_0_#be123c]" />
                <span className="text-slate-600">Ocupado <span className="text-rose-700">{occupied}</span></span>
              </div>
            </div>
          </div>

          {/* Barra de porcentaje global */}
          <div className="mb-8">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              <span>Ocupación total</span>
              <span>{Math.round((occupied / allSlots.length) * 100)}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(occupied / allSlots.length) * 100}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full"
              />
            </div>
          </div>

          {/* Grid de slots por filas con etiqueta de fila */}
          <div className="space-y-3 overflow-x-auto pb-2">
            {SLOT_ROWS.map((row, rowIdx) => {
              const rowLabel = row[0].id[0]; // 'A', 'B', ...
              return (
                <div key={rowLabel} className="flex items-center gap-3 min-w-[520px]">
                  {/* Etiqueta de fila */}
                  <span className="text-xs font-black text-slate-400 w-4 shrink-0">{rowLabel}</span>

                  {/* Slots */}
                  <div className="flex-1 grid grid-cols-12 gap-2">
                    {row.map((slot, colIdx) => (
                      <Slot3D
                        key={slot.id}
                        id={slot.id}
                        occupied={slot.occupied}
                        delay={rowIdx * 0.05 + colIdx * 0.025}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carretera (vía central) */}
          <div className="mt-4 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-dashed border-slate-300" />
            </div>
            <span className="relative z-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-3">
              Vía de Circulación Principal
            </span>
          </div>
        </div>

        {/* Barras de estado + Mejor rendimiento */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Ocupación por Parqueadero</h3>
            <div className="space-y-6">
              <ParkingBar name="Parqueadero A" occupancy={92} capacity={50} status="Saturado"   color="bg-rose-500"    />
              <ParkingBar name="Parqueadero B" occupancy={60} capacity={60} status="Óptimo"     color="bg-emerald-500" />
              <ParkingBar name="Parqueadero C" occupancy={78} capacity={55} status="Precaución" color="bg-amber-500"   />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Mejor Rendimiento</h3>
            <div className="flex-1 flex flex-col justify-center items-center text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <TrendingUp className="h-10 w-10 text-emerald-600" />
              </div>
              <h4 className="font-bold text-slate-700">Parqueadero líder</h4>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">Parqueadero B</p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Mayor rotación y mejor distribución de demanda en la última hora.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Subcomponentes ───────────────────────────────────────────────────────────

function KPICard({ title, value, subtitle, trend, isPositive, icon }: KPICardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <div className="text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100">{icon}</div>
      </div>
      <div className="flex items-end gap-2">
        <h4 className="text-3xl font-black text-slate-800">{value}</h4>
        {subtitle && <span className="text-sm font-medium text-slate-500 mb-1">{subtitle}</span>}
      </div>
      {trend && (
        <div className={clsx(
          'flex items-center gap-1 mt-2 text-xs font-bold',
          isPositive === true ? 'text-emerald-600' : isPositive === false ? 'text-rose-600' : 'text-slate-500'
        )}>
          <ArrowUpRight className="h-3.5 w-3.5" />
          {trend} vs ayer
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
          <span className="text-xs font-medium text-slate-400 ml-2">
            ({Math.round((occupancy / 100) * capacity)}/{capacity} cupos)
          </span>
        </div>
        <span className="text-xs font-bold text-slate-600">{occupancy}% · {status}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${occupancy}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}
