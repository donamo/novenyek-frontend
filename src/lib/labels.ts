import type {
  EventType,
  HumidityLevel,
  LightLevel,
  Orientation,
  OverallStatus,
  PestSuspicion,
  PlantSize,
  PlantStatus
} from "./api";

export const orientationLabels: Record<Orientation, string> = {
  north: "Észak",
  south: "Dél",
  east: "Kelet",
  west: "Nyugat",
  mixed: "Vegyes"
};

export const lightLabels: Record<LightLevel, string> = {
  low: "Gyenge",
  medium: "Közepes",
  high: "Erős"
};

export const humidityLabels: Record<HumidityLevel, string> = {
  low: "Alacsony",
  normal: "Normál",
  high: "Magas"
};

export const plantStatusLabels: Record<PlantStatus, string> = {
  active: "Aktív",
  inactive: "Inaktív",
  dead: "Elpusztult",
  gifted: "Elajándékozva"
};

export const plantSizeLabels: Record<PlantSize, string> = {
  small: "Kicsi",
  medium: "Közepes",
  large: "Nagy"
};

export const overallStatusLabels: Record<OverallStatus, string> = {
  good: "Jó",
  medium: "Figyelendő",
  bad: "Problémás",
  unknown: "Ismeretlen"
};

export const pestSuspicionLabels: Record<PestSuspicion, string> = {
  none: "Nincs",
  possible: "Lehetséges",
  yes: "Igen",
  unknown: "Ismeretlen"
};

export const eventTypeLabels: Record<EventType, string> = {
  watering: "Öntözés",
  repotting: "Átültetés",
  fertilizing: "Tápoldatozás",
  pruning: "Metszés",
  move: "Helyváltoztatás",
  treatment: "Kezelés",
  note: "Jegyzet",
  photo: "Fotó",
  ai_analysis: "AI elemzés"
};
