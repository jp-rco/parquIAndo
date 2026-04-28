import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Navigation, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── World dimensions ──────────────────────────────────────────────────────────
const SW = 130, SH = 80, SGAP = 22, N = 13, TOP = 100;
const LX = 8;
const LANE_L = LX + SW + 18;   // 156
const LANE_R = LANE_L + 110;   // 266
const RX = LANE_R + 18;        // 284
const WW = RX + SW + 8;        // 422
const WH = TOP + N * (SH + SGAP) + 420;
const CX = (LANE_L + LANE_R) / 2; // lane center X

// ── Slot data (index 3 = target, must be free) ────────────────────────────────
const OCC_L = [1,1,1,0,1,1,0,1,1,0,1,1,1];
const OCC_R = [1,0,1,1,1,0,1,0,1,1,1,0,1];
const mkSlots = (occ: number[], x: number) =>
  occ.map((o, i) => ({ id: `${x === LX ? 'L' : 'R'}${i + 1}`, x, y: TOP + i * (SH + SGAP), occ: !!o, target: x === LX && i === 3 }));
const leftSlots  = mkSlots(OCC_L, LX);
const rightSlots = mkSlots(OCC_R, RX);
const allSlots   = [...leftSlots, ...rightSlots];

// ── Target slot ───────────────────────────────────────────────────────────────
const T = leftSlots[3];
const TCY = T.y + SH / 2;
const CAR_Y_WORLD = WH - 220;
const SCROLL_TOTAL = CAR_Y_WORLD - TCY - 140;

// SVG route: straight up lane → turn left into slot
const ROUTE = `M ${CX} ${CAR_Y_WORLD} L ${CX} ${TCY} L ${T.x + SW} ${TCY}`;

// ── Slot 3D component ─────────────────────────────────────────────────────────
function Slot({ slot }: { slot: typeof allSlots[0] }) {
  if (slot.target) {
    return (
      <motion.div
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        style={{ position: 'absolute', left: slot.x, top: slot.y, width: SW, height: SH }}
        className="rounded-xl border-4 border-blue-500 bg-blue-400/30 flex flex-col items-center justify-center"
      >
        <span className="text-[9px] font-black text-blue-800">{slot.id}</span>
        <span className="text-[7px] font-bold text-blue-700 mt-0.5">TU SLOT</span>
      </motion.div>
    );
  }

  const green = !slot.occ;
  const bg    = green ? 'bg-emerald-400' : 'bg-rose-400';
  const bdr   = green ? 'border-emerald-600' : 'border-rose-600';
  const shadow = green
    ? '0 6px 0 #059669, 0 8px 14px rgba(16,185,129,0.35)'
    : '0 6px 0 #be123c, 0 8px 14px rgba(244,63,94,0.35)';

  return (
    <div
      style={{ position: 'absolute', left: slot.x, top: slot.y, width: SW, height: SH, boxShadow: shadow }}
      className={`rounded-xl border-b-4 ${bg} ${bdr} flex flex-col items-center justify-center relative overflow-hidden`}
    >
      {/* gloss */}
      <div className={`absolute top-1 left-1 right-1 h-4 rounded-t-lg opacity-40 ${green ? 'bg-emerald-200' : 'bg-rose-200'}`} />
      <span className={`relative z-10 text-[9px] font-black ${green ? 'text-emerald-900' : 'text-rose-900'}`}>{slot.id}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function NavigationMode() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const parkingName = searchParams.get('parking') || 'Parqueadero B';
  const dest        = searchParams.get('dest') || '';
  const isSabana    = dest.toLowerCase().includes('sabana') || !dest;

  const [progress, setProgress] = useState(0);
  const [arrived,  setArrived]  = useState(false);

  useEffect(() => {
    if (!isSabana) return;
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(t); setTimeout(() => setArrived(true), 800); return 100; }
        return p + 0.35;
      });
    }, 60);
    return () => clearInterval(t);
  }, [isSabana]);

  if (!isSabana) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-slate-100">
        <ShieldAlert className="h-16 w-16 text-amber-500 mb-4" />
        <h2 className="text-2xl font-black text-slate-800 mb-2">Vista 3D no disponible</h2>
        <p className="text-slate-500 mb-6">Solo disponible para la Universidad de La Sabana.</p>
        <button onClick={() => navigate(-1)} className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold">Volver</button>
      </div>
    );
  }

  const worldY = -(progress / 100) * SCROLL_TOTAL;
  // Car X: moves from lane center to target slot center when > 80%
  const carX_offset = progress > 80 ? -((progress - 80) / 20) * (CX - (T.x + SW / 2)) : 0;
  const distance = Math.max(0, Math.round(50 - (progress / 100) * 50));
  const instruction =
    arrived        ? '¡Llegaste! Slot L4 asegurado' :
    progress > 80  ? 'Gira a la izquierda → Slot L4' :
    progress > 40  ? 'Continúa recto por el pasillo' :
                     'Sigue recto hacia el parqueadero';
  const arrowRotate = progress > 80 ? '-rotate-90' : '';

  return (
    <div className="h-full w-full bg-[#eef0f3] flex flex-col overflow-hidden font-sans select-none relative">

      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="absolute top-5 left-5 z-50 p-3 bg-white/80 backdrop-blur-md hover:bg-white rounded-full shadow-md text-slate-700">
        <ArrowLeft className="h-5 w-5" />
      </button>

      {/* Top info card */}
      <motion.div
        initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="relative z-30 mx-auto mt-5 w-[88%] max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100 px-5 py-4 flex items-center gap-4"
      >
        <div className={`h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 transition-transform duration-1000 ${arrowRotate}`}>
          <Navigation className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-slate-900 truncate">{instruction}</p>
          <p className="text-xs text-slate-400 mt-0.5">{parkingName}</p>
        </div>
        <div className="text-right shrink-0 pl-4 border-l border-slate-100">
          <p className="text-2xl font-black text-slate-900">{distance}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase">metros</p>
        </div>
      </motion.div>

      {/* ── 3D perspective viewport ── */}
      <div className="flex-1 relative overflow-hidden" style={{ perspective: '700px', perspectiveOrigin: '50% 100%' }}>

        {/* World */}
        <div
          className="absolute left-1/2"
          style={{
            width: WW, height: WH,
            marginLeft: -WW / 2,
            top: '38%',
            transformOrigin: '50% 0%',
            transform: `rotateX(54deg) translateY(${worldY}px)`,
          }}
        >
          {/* Floor */}
          <div className="absolute inset-0 bg-[#f4f5f8]" />

          {/* Lane */}
          <div className="absolute top-0 bottom-0 bg-white/80 border-x border-slate-200"
            style={{ left: LANE_L, width: LANE_R - LANE_L }}>
            <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-dashed border-slate-300/70" />
          </div>

          {/* Slots */}
          {allSlots.map(s => <Slot key={s.id} slot={s} />)}

          {/* Route SVG */}
          <svg className="absolute inset-0 overflow-visible pointer-events-none" width={WW} height={WH} style={{ zIndex: 10 }}>
            {/* Glow */}
            <path d={ROUTE} fill="none" stroke="#3b82f6" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" opacity={0.18} />
            {/* Line */}
            <path d={ROUTE} fill="none" stroke="#3b82f6" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
            {/* Arrow at turn */}
            <polygon
              points={`${T.x + SW + 4},${TCY - 12} ${T.x + SW - 14},${TCY} ${T.x + SW + 4},${TCY + 12}`}
              fill="#3b82f6"
            />
          </svg>

          {/* Ego car */}
          <div
            className="absolute z-20 transition-all duration-300"
            style={{
              width: 68, height: 110,
              left: CX - 34 - carX_offset,
              top: CAR_Y_WORLD - 55,
            }}
          >
            {/* Body */}
            <div className="w-full h-full bg-slate-800 rounded-t-[34px] rounded-b-xl relative overflow-hidden"
              style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 8px 24px rgba(255,255,255,0.12)' }}>
              {/* Roof glass */}
              <div className="absolute top-6 left-3 right-3 h-14 bg-slate-900 rounded-t-[20px] rounded-b-lg" />
              {/* Left brake light */}
              <div className="absolute bottom-2 left-2.5 w-5 h-2 bg-red-500 rounded-full"
                style={{ boxShadow: '0 0 10px 3px rgba(239,68,68,0.7)' }} />
              {/* Right brake light */}
              <div className="absolute bottom-2 right-2.5 w-5 h-2 bg-red-500 rounded-full"
                style={{ boxShadow: '0 0 10px 3px rgba(239,68,68,0.7)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="relative z-30 bg-white/90 backdrop-blur-md border-t border-slate-200 px-6 py-4">
        <div className="flex justify-around items-center max-w-sm mx-auto">
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Tiempo</p>
            <p className="text-xl font-black text-slate-900">{Math.max(0, Math.ceil((100 - progress) / 20))} min</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Distancia</p>
            <p className="text-xl font-black text-slate-900">{distance} m</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Slot</p>
            <p className="text-xl font-black text-blue-600">L4</p>
          </div>
        </div>
      </div>

      {/* Arrival overlay */}
      <AnimatePresence>
        {arrived && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">¡Parqueo Exitoso!</h3>
              <p className="text-slate-500 mb-7">Slot <span className="font-black text-slate-900">L4</span> asegurado en {parkingName}. La tarifa comenzará a correr.</p>
              <button onClick={() => navigate('/')} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg">
                Finalizar viaje
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
