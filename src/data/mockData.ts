export interface ParkingLot {
  id: string;
  name: string;
  occupancy: number;
  status: string;
  waitTime: string;
  eta: string;
  availableSpaces: number;
  aiMessage: string;
  prediction?: string;
  risk: string;
  recommended: boolean;
  lat: number;
  lng: number;
}

export const parkingLots: ParkingLot[] = [
  {
    id: "A",
    name: "Parqueadero A",
    occupancy: 92,
    status: "Alta ocupación",
    waitTime: "10 minutos",
    eta: "3 minutos",
    availableSpaces: 4,
    aiMessage: "Alta probabilidad de espera. No recomendado en este momento.",
    risk: "Alto",
    recommended: false,
    lat: 4.8596,
    lng: -74.0321
  },
  {
    id: "B",
    name: "Parqueadero B",
    occupancy: 60,
    status: "Cupos disponibles",
    waitTime: "Sin espera",
    eta: "4 minutos",
    availableSpaces: 24,
    aiMessage: "Mejor opción actual. Disponibilidad estable y buena rotación.",
    prediction: "Disponibilidad estable durante los próximos 15 minutos",
    risk: "Bajo",
    recommended: true,
    lat: 4.8610,
    lng: -74.0305
  },
  {
    id: "C",
    name: "Parqueadero C",
    occupancy: 78,
    status: "Se llenará pronto",
    waitTime: "Riesgo medio",
    eta: "6 minutos",
    availableSpaces: 12,
    aiMessage: "Riesgo medio. Puede llenarse antes de que llegues.",
    prediction: "Se llenará en 8 minutos según la demanda actual",
    risk: "Medio",
    recommended: false,
    lat: 4.8632,
    lng: -74.0330
  }
];

export const getAIParkingRecommendation = async (_destination: string): Promise<ParkingLot[]> => {
  // Simulación de delay por análisis de IA
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(parkingLots);
    }, 2500); // 2.5s para simular carga
  });
};
