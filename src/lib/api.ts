const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";
const GOOGLE_LOGIN_PATH = import.meta.env.VITE_GOOGLE_LOGIN_PATH ?? "/auth/login/google";

export type Orientation = "north" | "south" | "east" | "west" | "mixed";
export type LightLevel = "low" | "medium" | "high";
export type HumidityLevel = "low" | "normal" | "high";
export type PlantSize = "small" | "medium" | "large";
export type PlantStatus = "active" | "inactive" | "dead" | "gifted";
export type EventType =
  | "watering"
  | "repotting"
  | "fertilizing"
  | "pruning"
  | "move"
  | "treatment"
  | "note"
  | "photo"
  | "ai_analysis";
export type OverallStatus = "good" | "medium" | "bad" | "unknown";
export type PestSuspicion = "none" | "possible" | "yes" | "unknown";

export type Room = {
  id: string;
  name: string;
  orientation?: Orientation | null;
  lightLevel?: LightLevel | null;
  humidityLevel?: HumidityLevel | null;
  averageTemperature?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Plant = {
  id: string;
  name: string;
  nickname?: string | null;
  species?: string | null;
  category?: string | null;
  size?: PlantSize | null;
  potSizeCm?: number | null;
  roomId?: string | null;
  room?: Room | null;
  locationDescription?: string | null;
  acquiredAt?: string | null;
  acquiredFrom?: string | null;
  status?: PlantStatus | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type PlantRequirement = {
  id?: string;
  plantId?: string;
  lightNeed?: string | null;
  waterNeed?: string | null;
  humidityNeed?: string | null;
  temperatureNeed?: string | null;
  soilNeed?: string | null;
  fertilizingNeed?: string | null;
  repottingFrequency?: string | null;
  commonProblems?: string | null;
  toxicity?: string | null;
  source?: string | null;
};

export type PlantEvent = {
  id: string;
  plantId: string;
  type: EventType;
  eventDate: string;
  title: string;
  description?: string | null;
  createdAt?: string;
};

export type PlantStatusReport = {
  id: string;
  plantId: string;
  reportMonth: string;
  overallStatus?: OverallStatus | null;
  leafStatus?: string | null;
  growthStatus?: string | null;
  soilStatus?: string | null;
  pestSuspicion?: PestSuspicion | null;
  wateringAssessment?: string | null;
  lightAssessment?: string | null;
  notes?: string | null;
  aiSummary?: string | null;
  aiRecommendations?: string | null;
};

export type PlantPhoto = {
  id: string;
  plantId: string;
  statusReportId?: string | null;
  filePath: string;
  thumbnailPath?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
  originalFilename?: string | null;
  uploadedAt?: string;
};

export type Dashboard = {
  totalPlants?: number;
  goodPlants?: number;
  watchPlants?: number;
  badPlants?: number;
  missingMonthlyStatus?: number;
};

export type CurrentUser = {
  id: string;
  email: string;
  displayName?: string | null;
  isAdmin: boolean;
  isEnabled: boolean;
};

type GraphQlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

async function graphqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/graphql`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `API hiba: ${response.status}`);
  }

  const payload = (await response.json()) as GraphQlResponse<T>;
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("\n"));
  }

  if (!payload.data) throw new Error("Üres GraphQL válasz.");
  return payload.data;
}

async function authRequest<T>(path: string, method: "GET" | "POST" = "GET"): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include"
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `API hiba: ${response.status}`);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = () => reject(new Error("Nem sikerült beolvasni a képet."));
    reader.readAsDataURL(blob);
  });
}

const roomFields = `
  id
  name
  orientation
  lightLevel
  humidityLevel
  averageTemperature
  notes
  createdAt
  updatedAt
  _count { plants }
`;

const plantFields = `
  id
  name
  nickname
  species
  category
  size
  potSizeCm
  roomId
  room { ${roomFields} }
  locationDescription
  acquiredAt
  acquiredFrom
  status
  notes
  createdAt
  updatedAt
  _count { events photos statusReports aiAnalyses }
`;

const requirementFields = `
  id
  plantId
  lightNeed
  waterNeed
  humidityNeed
  temperatureNeed
  soilNeed
  fertilizingNeed
  repottingFrequency
  commonProblems
  toxicity
  source
`;

const eventFields = `
  id
  plantId
  type
  eventDate
  title
  description
  createdAt
`;

const statusReportFields = `
  id
  plantId
  reportMonth
  overallStatus
  leafStatus
  growthStatus
  soilStatus
  pestSuspicion
  wateringAssessment
  lightAssessment
  notes
  aiSummary
  aiRecommendations
`;

const photoFields = `
  id
  plantId
  statusReportId
  filePath
  thumbnailPath
  caption
  width
  height
  mimeType
  originalFilename
  uploadedAt
`;

export function getAssetUrl(path?: string | null) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path.startsWith("/") ? path : `/${path}`, API_BASE_URL).toString();
}

export const api = {
  baseUrl: API_BASE_URL,
  getAssetUrl,
  getGoogleLoginUrl: (returnTo = window.location.origin) => {
    const url = new URL(`${API_BASE_URL}${GOOGLE_LOGIN_PATH}`);
    url.searchParams.set("redirectTo", returnTo);
    url.searchParams.set("returnTo", returnTo);
    url.searchParams.set("frontendUrl", returnTo);
    return url.toString();
  },
  getCurrentUser: async () => {
    return authRequest<CurrentUser>("/auth/me");
  },
  logout: () => authRequest<void>("/auth/logout", "POST"),
  getDashboard: async () => {
    const data = await graphqlRequest<{
      dashboard: {
        totals: {
          plants: number;
          goodStatusReports: number;
          watchStatusReports: number;
          problematicStatusReports: number;
          missingMonthlyStatus: number;
        };
      };
    }>(`
      query Dashboard {
        dashboard {
          totals {
            plants
            goodStatusReports
            watchStatusReports
            problematicStatusReports
            missingMonthlyStatus
          }
        }
      }
    `);
    return {
      totalPlants: data.dashboard.totals.plants,
      goodPlants: data.dashboard.totals.goodStatusReports,
      watchPlants: data.dashboard.totals.watchStatusReports,
      badPlants: data.dashboard.totals.problematicStatusReports,
      missingMonthlyStatus: data.dashboard.totals.missingMonthlyStatus
    } satisfies Dashboard;
  },
  getRooms: async () => {
    const data = await graphqlRequest<{ rooms: Room[] }>(`query Rooms { rooms { ${roomFields} } }`);
    return data.rooms;
  },
  createRoom: async (body: Partial<Room>) => {
    const data = await graphqlRequest<{ createRoom: Room }>(
      `mutation CreateRoom($input: CreateRoomDto!) { createRoom(input: $input) { ${roomFields} } }`,
      { input: body }
    );
    return data.createRoom;
  },
  updateRoom: async (id: string, body: Partial<Room>) => {
    const data = await graphqlRequest<{ updateRoom: Room }>(
      `mutation UpdateRoom($id: ID!, $input: UpdateRoomDto!) { updateRoom(id: $id, input: $input) { ${roomFields} } }`,
      { id, input: body }
    );
    return data.updateRoom;
  },
  deleteRoom: async (id: string) => {
    await graphqlRequest<{ deleteRoom: { deleted: boolean } }>(
      "mutation DeleteRoom($id: ID!) { deleteRoom(id: $id) { deleted } }",
      { id }
    );
  },
  getPlants: async () => {
    const data = await graphqlRequest<{ plants: Plant[] }>(`query Plants { plants { ${plantFields} } }`);
    return data.plants;
  },
  getPlant: async (id: string) => {
    const data = await graphqlRequest<{ plant: Plant }>(
      `query Plant($id: ID!) { plant(id: $id) { ${plantFields} } }`,
      { id }
    );
    return data.plant;
  },
  createPlant: async (body: Partial<Plant>) => {
    const data = await graphqlRequest<{ createPlant: Plant }>(
      `mutation CreatePlant($input: CreatePlantDto!) { createPlant(input: $input) { ${plantFields} } }`,
      { input: body }
    );
    return data.createPlant;
  },
  createPlantFromPhoto: async (photo: Blob, options: { filename: string; caption?: string }) => {
    const data = await graphqlRequest<{ createPlantFromPhoto: Plant }>(
      `mutation CreatePlantFromPhoto($input: CreatePlantFromPhotoInput!) {
        createPlantFromPhoto(input: $input) { ${plantFields} }
      }`,
      {
        input: {
          imageBase64: await blobToBase64(photo),
          mimeType: "image/jpeg",
          originalFilename: options.filename,
          caption: options.caption
        }
      }
    );
    return data.createPlantFromPhoto;
  },
  updatePlant: async (id: string, body: Partial<Plant>) => {
    const data = await graphqlRequest<{ updatePlant: Plant }>(
      `mutation UpdatePlant($id: ID!, $input: UpdatePlantDto!) { updatePlant(id: $id, input: $input) { ${plantFields} } }`,
      { id, input: body }
    );
    return data.updatePlant;
  },
  deletePlant: async (id: string) => {
    await graphqlRequest<{ deletePlant: { deleted: boolean } }>(
      "mutation DeletePlant($id: ID!) { deletePlant(id: $id) { deleted } }",
      { id }
    );
  },
  getPlantRequirements: async (plantId: string) => {
    const data = await graphqlRequest<{ plantRequirement: PlantRequirement | null }>(
      `query PlantRequirement($plantId: ID!) { plantRequirement(plantId: $plantId) { ${requirementFields} } }`,
      { plantId }
    );
    return data.plantRequirement;
  },
  savePlantRequirements: async (plantId: string, body: PlantRequirement) => {
    const data = await graphqlRequest<{ upsertPlantRequirement: PlantRequirement }>(
      `mutation UpsertPlantRequirement($plantId: ID!, $input: UpsertPlantRequirementDto!) {
        upsertPlantRequirement(plantId: $plantId, input: $input) { ${requirementFields} }
      }`,
      { plantId, input: body }
    );
    return data.upsertPlantRequirement;
  },
  getPlantEvents: async (plantId: string) => {
    const data = await graphqlRequest<{ plantEvents: PlantEvent[] }>(
      `query PlantEvents($plantId: ID!) { plantEvents(plantId: $plantId) { ${eventFields} } }`,
      { plantId }
    );
    return data.plantEvents;
  },
  createPlantEvent: async (plantId: string, body: Partial<PlantEvent>) => {
    const data = await graphqlRequest<{ createPlantEvent: PlantEvent }>(
      `mutation CreatePlantEvent($plantId: ID!, $input: CreatePlantEventDto!) {
        createPlantEvent(plantId: $plantId, input: $input) { ${eventFields} }
      }`,
      { plantId, input: body }
    );
    return data.createPlantEvent;
  },
  getStatusReports: async (plantId: string) => {
    const data = await graphqlRequest<{ plantStatusReports: PlantStatusReport[] }>(
      `query PlantStatusReports($plantId: ID!) {
        plantStatusReports(plantId: $plantId) { ${statusReportFields} }
      }`,
      { plantId }
    );
    return data.plantStatusReports;
  },
  createStatusReport: async (plantId: string, body: Partial<PlantStatusReport>) => {
    const data = await graphqlRequest<{ createPlantStatusReport: PlantStatusReport }>(
      `mutation CreatePlantStatusReport($plantId: ID!, $input: CreatePlantStatusReportDto!) {
        createPlantStatusReport(plantId: $plantId, input: $input) { ${statusReportFields} }
      }`,
      { plantId, input: body }
    );
    return data.createPlantStatusReport;
  },
  getPhotos: async (plantId: string) => {
    const data = await graphqlRequest<{ plantPhotos: PlantPhoto[] }>(
      `query PlantPhotos($plantId: ID!) { plantPhotos(plantId: $plantId) { ${photoFields} } }`,
      { plantId }
    );
    return data.plantPhotos;
  },
  uploadPhoto: async (
    plantId: string,
    photo: Blob,
    options: { filename: string; statusReportId?: string; caption?: string; takenAt?: string }
  ) => {
    const data = await graphqlRequest<{ createPlantPhotoFromBase64: PlantPhoto }>(
      `mutation CreatePlantPhotoFromBase64($input: CreatePlantPhotoFromBase64Input!) {
        createPlantPhotoFromBase64(input: $input) { ${photoFields} }
      }`,
      {
        input: {
          plantId,
          imageBase64: await blobToBase64(photo),
          mimeType: "image/jpeg",
          originalFilename: options.filename,
          statusReportId: options.statusReportId,
          caption: options.caption,
          takenAt: options.takenAt
        }
      }
    );
    return data.createPlantPhotoFromBase64;
  },
  getUsers: async () => {
    const data = await graphqlRequest<{ users: CurrentUser[] }>(`
      query Users {
        users { id email displayName isAdmin isEnabled }
      }
    `);
    return data.users;
  },
  setUserEnabled: async (id: string, isEnabled: boolean) => {
    const data = await graphqlRequest<{ updateUserEnabled: CurrentUser }>(
      `mutation UpdateUserEnabled($input: UpdateUserEnabledInput!) {
        updateUserEnabled(input: $input) { id email displayName isAdmin isEnabled }
      }`,
      { input: { id, isEnabled } }
    );
    return data.updateUserEnabled;
  }
};
