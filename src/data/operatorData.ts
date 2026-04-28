// ── Datos simulados para el Panel Operador ──

export interface SlotData { id: string; occupied: boolean }
export interface ZoneData {
  id: string; name: string; color: string;
  slots: SlotData[]; capacity: number;
  rotation: number; avgStay: number; revenue: number;
}
export interface ParkingData {
  id: string; name: string; zones: ZoneData[];
  peakHour: string; riskLevel: string;
  cameras: { name: string; status: 'active' | 'warning' | 'offline' }[];
  lastSync: number; detectionAccuracy: number;
}

const mkSlots = (prefix: string, count: number, occupied: boolean[]): SlotData[] =>
  occupied.map((o, i) => ({ id: `${prefix}${String(i + 1).padStart(2, '0')}`, occupied: o }));

export const PARKINGS: ParkingData[] = [
  {
    id: 'A', name: 'Parqueadero A',
    peakHour: '7:30–9:00 a.m.', riskLevel: 'Alto',
    lastSync: 8, detectionAccuracy: 96,
    cameras: [
      { name: 'Cámara Entrada', status: 'active' },
      { name: 'Cámara Zona A1', status: 'active' },
      { name: 'Cámara Zona A2', status: 'warning' },
    ],
    zones: [
      { id: 'A1', name: 'Zona A1', color: 'rose', capacity: 15,
        rotation: 22, avgStay: 3.2, revenue: 1850000,
        slots: mkSlots('A1-', 15, [true,true,true,false,true,true,true,true,false,true,true,true,true,true,true]) },
      { id: 'A2', name: 'Zona A2', color: 'amber', capacity: 15,
        rotation: 18, avgStay: 2.8, revenue: 1420000,
        slots: mkSlots('A2-', 15, [true,true,false,true,true,true,false,true,true,true,true,false,true,true,true]) },
      { id: 'A3', name: 'Zona A3', color: 'rose', capacity: 20,
        rotation: 15, avgStay: 4.1, revenue: 2100000,
        slots: mkSlots('A3-', 20, [true,true,true,true,true,false,true,true,true,true,true,true,false,true,true,true,true,true,true,true]) },
    ],
  },
  {
    id: 'B', name: 'Parqueadero B',
    peakHour: '8:00–10:00 a.m.', riskLevel: 'Bajo',
    lastSync: 12, detectionAccuracy: 94,
    cameras: [
      { name: 'Cámara Entrada', status: 'active' },
      { name: 'Cámara Zona B1', status: 'active' },
      { name: 'Cámara Zona B2', status: 'active' },
      { name: 'Cámara Zona B3', status: 'warning' },
    ],
    zones: [
      { id: 'B1', name: 'Zona B1', color: 'emerald', capacity: 12,
        rotation: 24, avgStay: 2.1, revenue: 980000,
        slots: mkSlots('B1-', 12, [true,true,false,false,true,false,true,true,false,true,false,false]) },
      { id: 'B2', name: 'Zona B2', color: 'emerald', capacity: 12,
        rotation: 20, avgStay: 2.5, revenue: 1100000,
        slots: mkSlots('B2-', 12, [false,true,false,false,true,false,true,false,false,true,false,true]) },
      { id: 'B3', name: 'Zona B3', color: 'amber', capacity: 12,
        rotation: 16, avgStay: 3.0, revenue: 870000,
        slots: mkSlots('B3-', 12, [true,true,true,false,true,true,false,true,true,false,true,true]) },
      { id: 'B4', name: 'Zona B4', color: 'emerald', capacity: 12,
        rotation: 21, avgStay: 2.3, revenue: 950000,
        slots: mkSlots('B4-', 12, [false,true,false,false,false,true,false,false,true,false,false,true]) },
      { id: 'B5', name: 'Zona B5', color: 'emerald', capacity: 12,
        rotation: 19, avgStay: 2.7, revenue: 890000,
        slots: mkSlots('B5-', 12, [false,false,true,false,true,false,false,true,false,false,true,false]) },
    ],
  },
  {
    id: 'C', name: 'Parqueadero C',
    peakHour: '11:00 a.m.–1:00 p.m.', riskLevel: 'Medio',
    lastSync: 15, detectionAccuracy: 91,
    cameras: [
      { name: 'Cámara Entrada', status: 'active' },
      { name: 'Cámara Zona C1', status: 'active' },
      { name: 'Cámara Zona C2', status: 'offline' },
    ],
    zones: [
      { id: 'C1', name: 'Zona C1', color: 'amber', capacity: 18,
        rotation: 17, avgStay: 3.5, revenue: 1350000,
        slots: mkSlots('C1-', 18, [true,false,true,true,false,true,true,true,false,true,true,false,true,true,false,true,true,false]) },
      { id: 'C2', name: 'Zona C2', color: 'emerald', capacity: 18,
        rotation: 14, avgStay: 2.9, revenue: 1180000,
        slots: mkSlots('C2-', 18, [false,true,false,true,false,false,true,false,true,false,true,false,false,true,false,true,false,true]) },
      { id: 'C3', name: 'Zona C3', color: 'rose', capacity: 19,
        rotation: 12, avgStay: 4.5, revenue: 1620000,
        slots: mkSlots('C3-', 19, [true,true,true,true,false,true,true,true,true,true,true,false,true,true,true,true,true,true,true]) },
    ],
  },
];

// Helper functions
export const getOccupied = (z: ZoneData) => z.slots.filter(s => s.occupied).length;
export const getOccupancy = (z: ZoneData) => Math.round((getOccupied(z) / z.capacity) * 100);

export const getParkingStats = (p: ParkingData) => {
  const totalCap = p.zones.reduce((a, z) => a + z.capacity, 0);
  const totalOcc = p.zones.reduce((a, z) => a + getOccupied(z), 0);
  const totalFree = totalCap - totalOcc;
  const occupancy = Math.round((totalOcc / totalCap) * 100);
  const avgRotation = Math.round(p.zones.reduce((a, z) => a + z.rotation, 0) / p.zones.length);
  const avgStay = +(p.zones.reduce((a, z) => a + z.avgStay, 0) / p.zones.length).toFixed(1);
  const totalRevenue = p.zones.reduce((a, z) => a + z.revenue, 0);
  return { totalCap, totalOcc, totalFree, occupancy, avgRotation, avgStay, totalRevenue };
};

export const DEMAND_FORECAST = [
  { hour: '4:00 PM', occ: 72 }, { hour: '4:30 PM', occ: 68 },
  { hour: '5:00 PM', occ: 61 }, { hour: '5:30 PM', occ: 55 },
  { hour: '6:00 PM', occ: 42 }, { hour: '6:30 PM', occ: 35 },
];

export const HOURLY_HISTORY = [
  { hour: '6 AM', occ: 12 }, { hour: '7 AM', occ: 38 }, { hour: '8 AM', occ: 72 },
  { hour: '9 AM', occ: 88 }, { hour: '10 AM', occ: 82 }, { hour: '11 AM', occ: 76 },
  { hour: '12 PM', occ: 85 }, { hour: '1 PM', occ: 80 }, { hour: '2 PM', occ: 74 },
  { hour: '3 PM', occ: 70 }, { hour: '4 PM', occ: 72 },
];

export const AI_RECOMMENDATIONS = [
  { text: 'Redirigir vehículos hacia Zona B1 por mayor disponibilidad.', priority: 'info' as const },
  { text: 'Activar señalización hacia Parqueadero B.', priority: 'info' as const },
  { text: 'Se espera saturación alta entre 7:30 a.m. y 9:00 a.m.', priority: 'warning' as const },
  { text: 'Parqueadero A está al 92%, evitar enviar más usuarios.', priority: 'danger' as const },
  { text: 'Abrir zona auxiliar en Parqueadero C para absorber demanda.', priority: 'info' as const },
];

export const ALERTS = [
  { text: 'Acceso principal con congestión alta.', type: 'danger' as const, time: 'Hace 2 min' },
  { text: 'Zona A3 alcanzó 90% de ocupación.', type: 'warning' as const, time: 'Hace 5 min' },
  { text: 'Cámara Zona C2 sin señal.', type: 'danger' as const, time: 'Hace 8 min' },
  { text: 'Alta demanda esperada por evento cercano.', type: 'warning' as const, time: 'Hace 12 min' },
  { text: 'Se recomienda abrir zona auxiliar.', type: 'info' as const, time: 'Hace 15 min' },
];
