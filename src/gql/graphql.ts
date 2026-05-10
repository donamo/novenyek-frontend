/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type AiAnalysisModel = {
  __typename?: 'AiAnalysisModel';
  confidence?: Maybe<AiConfidence>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  inputPhotoIds: Array<Scalars['String']['output']>;
  model: Scalars['String']['output'];
  ownerUserId: Scalars['ID']['output'];
  plantId: Scalars['ID']['output'];
  promptVersion: Scalars['String']['output'];
  provider: AiProvider;
  rawResponseJson: Scalars['String']['output'];
  recommendations: Array<Scalars['String']['output']>;
  statusReportId?: Maybe<Scalars['ID']['output']>;
  summary: Scalars['String']['output'];
};

export enum AiConfidence {
  High = 'high',
  Low = 'low',
  Medium = 'medium'
}

export enum AiProvider {
  Gemini = 'gemini',
  Mock = 'mock',
  Openai = 'openai',
  Openrouter = 'openrouter'
}

export type CreateAiAnalysisDto = {
  language?: InputMaybe<Scalars['String']['input']>;
  photoIds: Array<Scalars['ID']['input']>;
  provider?: InputMaybe<AiProvider>;
  statusReportId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreatePlantDto = {
  acquiredAt?: InputMaybe<Scalars['DateTime']['input']>;
  acquiredFrom?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  locationDescription?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  nickname?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  potSizeCm?: InputMaybe<Scalars['Int']['input']>;
  roomId?: InputMaybe<Scalars['ID']['input']>;
  size?: InputMaybe<PlantSize>;
  species?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<PlantStatus>;
};

export type CreatePlantEventDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  eventDate: Scalars['DateTime']['input'];
  title: Scalars['String']['input'];
  type: PlantEventType;
};

export type CreatePlantPhotoFromBase64Input = {
  caption?: InputMaybe<Scalars['String']['input']>;
  imageBase64: Scalars['String']['input'];
  mimeType?: InputMaybe<Scalars['String']['input']>;
  originalFilename?: InputMaybe<Scalars['String']['input']>;
  plantId: Scalars['ID']['input'];
  statusReportId?: InputMaybe<Scalars['ID']['input']>;
  takenAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CreatePlantStatusReportDto = {
  aiRecommendations?: InputMaybe<Scalars['String']['input']>;
  aiSummary?: InputMaybe<Scalars['String']['input']>;
  growthStatus?: InputMaybe<Scalars['String']['input']>;
  leafStatus?: InputMaybe<Scalars['String']['input']>;
  lightAssessment?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  overallStatus?: InputMaybe<OverallStatus>;
  pestSuspicion?: InputMaybe<PestSuspicion>;
  reportMonth: Scalars['String']['input'];
  soilStatus?: InputMaybe<Scalars['String']['input']>;
  wateringAssessment?: InputMaybe<Scalars['String']['input']>;
};

export type CreateRoomDto = {
  averageTemperature?: InputMaybe<Scalars['String']['input']>;
  humidityLevel?: InputMaybe<HumidityLevel>;
  lightLevel?: InputMaybe<LightLevel>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  orientation?: InputMaybe<RoomOrientation>;
};

export type DashboardModel = {
  __typename?: 'DashboardModel';
  currentMonth: Scalars['String']['output'];
  latestAiAnalyses: Array<AiAnalysisModel>;
  latestStatusReports: Array<PlantStatusReportModel>;
  totals: DashboardTotalsModel;
};

export type DashboardTotalsModel = {
  __typename?: 'DashboardTotalsModel';
  activePlants: Scalars['Int']['output'];
  goodStatusReports: Scalars['Int']['output'];
  missingMonthlyStatus: Scalars['Int']['output'];
  plants: Scalars['Int']['output'];
  problematicStatusReports: Scalars['Int']['output'];
  watchStatusReports: Scalars['Int']['output'];
};

export type DeleteResponse = {
  __typename?: 'DeleteResponse';
  deleted: Scalars['Boolean']['output'];
};

export enum HumidityLevel {
  High = 'high',
  Low = 'low',
  Normal = 'normal'
}

export enum LightLevel {
  High = 'high',
  Low = 'low',
  Medium = 'medium'
}

export type Mutation = {
  __typename?: 'Mutation';
  createAiAnalysis: AiAnalysisModel;
  createPlant: PlantModel;
  createPlantEvent: PlantEventModel;
  createPlantPhotoFromBase64: PlantPhotoModel;
  createPlantStatusReport: PlantStatusReportModel;
  createRoom: RoomModel;
  deletePlant: DeleteResponse;
  deletePlantEvent: DeleteResponse;
  deletePlantPhoto: DeleteResponse;
  deletePlantStatusReport: DeleteResponse;
  deleteRoom: DeleteResponse;
  updatePlant: PlantModel;
  updatePlantEvent: PlantEventModel;
  updatePlantStatusReport: PlantStatusReportModel;
  updateRoom: RoomModel;
  updateUserEnabled: UserModel;
  upsertPlantRequirement: PlantRequirementModel;
};


export type MutationCreateAiAnalysisArgs = {
  input: CreateAiAnalysisDto;
  plantId: Scalars['ID']['input'];
};


export type MutationCreatePlantArgs = {
  input: CreatePlantDto;
};


export type MutationCreatePlantEventArgs = {
  input: CreatePlantEventDto;
  plantId: Scalars['ID']['input'];
};


export type MutationCreatePlantPhotoFromBase64Args = {
  input: CreatePlantPhotoFromBase64Input;
};


export type MutationCreatePlantStatusReportArgs = {
  input: CreatePlantStatusReportDto;
  plantId: Scalars['ID']['input'];
};


export type MutationCreateRoomArgs = {
  input: CreateRoomDto;
};


export type MutationDeletePlantArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePlantEventArgs = {
  eventId: Scalars['ID']['input'];
  plantId: Scalars['ID']['input'];
};


export type MutationDeletePlantPhotoArgs = {
  photoId: Scalars['ID']['input'];
};


export type MutationDeletePlantStatusReportArgs = {
  id: Scalars['ID']['input'];
  plantId: Scalars['ID']['input'];
};


export type MutationDeleteRoomArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdatePlantArgs = {
  id: Scalars['ID']['input'];
  input: UpdatePlantDto;
};


export type MutationUpdatePlantEventArgs = {
  eventId: Scalars['ID']['input'];
  input: UpdatePlantEventDto;
  plantId: Scalars['ID']['input'];
};


export type MutationUpdatePlantStatusReportArgs = {
  id: Scalars['ID']['input'];
  input: UpdatePlantStatusReportDto;
  plantId: Scalars['ID']['input'];
};


export type MutationUpdateRoomArgs = {
  id: Scalars['ID']['input'];
  input: UpdateRoomDto;
};


export type MutationUpdateUserEnabledArgs = {
  input: UpdateUserEnabledInput;
};


export type MutationUpsertPlantRequirementArgs = {
  input: UpsertPlantRequirementDto;
  plantId: Scalars['ID']['input'];
};

export enum OverallStatus {
  Bad = 'bad',
  Good = 'good',
  Medium = 'medium',
  Unknown = 'unknown'
}

export enum PestSuspicion {
  None = 'none',
  Possible = 'possible',
  Unknown = 'unknown',
  Yes = 'yes'
}

export type PlantCountModel = {
  __typename?: 'PlantCountModel';
  aiAnalyses: Scalars['Int']['output'];
  events: Scalars['Int']['output'];
  photos: Scalars['Int']['output'];
  statusReports: Scalars['Int']['output'];
};

export type PlantEventModel = {
  __typename?: 'PlantEventModel';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  eventDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  ownerUserId: Scalars['ID']['output'];
  plantId: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  type: PlantEventType;
};

export enum PlantEventType {
  AiAnalysis = 'ai_analysis',
  Fertilizing = 'fertilizing',
  Move = 'move',
  Note = 'note',
  Photo = 'photo',
  Pruning = 'pruning',
  Repotting = 'repotting',
  Treatment = 'treatment',
  Watering = 'watering'
}

export type PlantModel = {
  __typename?: 'PlantModel';
  _count?: Maybe<PlantCountModel>;
  acquiredAt?: Maybe<Scalars['DateTime']['output']>;
  acquiredFrom?: Maybe<Scalars['String']['output']>;
  category?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  locationDescription?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  nickname?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  ownerUserId: Scalars['ID']['output'];
  potSizeCm?: Maybe<Scalars['Int']['output']>;
  room?: Maybe<RoomModel>;
  roomId?: Maybe<Scalars['ID']['output']>;
  size?: Maybe<PlantSize>;
  species?: Maybe<Scalars['String']['output']>;
  status: PlantStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type PlantPhotoModel = {
  __typename?: 'PlantPhotoModel';
  caption?: Maybe<Scalars['String']['output']>;
  filePath: Scalars['String']['output'];
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  mimeType: Scalars['String']['output'];
  originalFilename?: Maybe<Scalars['String']['output']>;
  ownerUserId: Scalars['ID']['output'];
  plantId: Scalars['ID']['output'];
  sizeBytes: Scalars['Int']['output'];
  statusReportId?: Maybe<Scalars['ID']['output']>;
  takenAt?: Maybe<Scalars['DateTime']['output']>;
  thumbnailPath?: Maybe<Scalars['String']['output']>;
  uploadedAt: Scalars['DateTime']['output'];
  width?: Maybe<Scalars['Int']['output']>;
};

export type PlantRequirementModel = {
  __typename?: 'PlantRequirementModel';
  commonProblems?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  fertilizingNeed?: Maybe<Scalars['String']['output']>;
  humidityNeed?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lightNeed?: Maybe<Scalars['String']['output']>;
  ownerUserId: Scalars['ID']['output'];
  plantId: Scalars['ID']['output'];
  repottingFrequency?: Maybe<Scalars['String']['output']>;
  soilNeed?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  temperatureNeed?: Maybe<Scalars['String']['output']>;
  toxicity?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  waterNeed?: Maybe<Scalars['String']['output']>;
};

export enum PlantSize {
  Large = 'large',
  Medium = 'medium',
  Small = 'small'
}

export enum PlantStatus {
  Active = 'active',
  Dead = 'dead',
  Gifted = 'gifted',
  Inactive = 'inactive'
}

export type PlantStatusReportModel = {
  __typename?: 'PlantStatusReportModel';
  aiRecommendations?: Maybe<Scalars['String']['output']>;
  aiSummary?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  growthStatus?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  leafStatus?: Maybe<Scalars['String']['output']>;
  lightAssessment?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  overallStatus: OverallStatus;
  ownerUserId: Scalars['ID']['output'];
  pestSuspicion?: Maybe<PestSuspicion>;
  plantId: Scalars['ID']['output'];
  reportMonth: Scalars['String']['output'];
  soilStatus?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  wateringAssessment?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  aiAnalysis: AiAnalysisModel;
  apiStatus: Scalars['String']['output'];
  dashboard: DashboardModel;
  me: UserModel;
  plant: PlantModel;
  plantAiAnalyses: Array<AiAnalysisModel>;
  plantEvents: Array<PlantEventModel>;
  plantExportJson: Scalars['String']['output'];
  plantExportMarkdown: Scalars['String']['output'];
  plantPhotos: Array<PlantPhotoModel>;
  plantRequirement?: Maybe<PlantRequirementModel>;
  plantStatusReport: PlantStatusReportModel;
  plantStatusReportPhotos: Array<PlantPhotoModel>;
  plantStatusReports: Array<PlantStatusReportModel>;
  plants: Array<PlantModel>;
  room: RoomModel;
  rooms: Array<RoomModel>;
  users: Array<UserModel>;
};


export type QueryAiAnalysisArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPlantArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPlantAiAnalysesArgs = {
  plantId: Scalars['ID']['input'];
};


export type QueryPlantEventsArgs = {
  plantId: Scalars['ID']['input'];
};


export type QueryPlantExportJsonArgs = {
  plantId: Scalars['ID']['input'];
};


export type QueryPlantExportMarkdownArgs = {
  plantId: Scalars['ID']['input'];
};


export type QueryPlantPhotosArgs = {
  plantId: Scalars['ID']['input'];
};


export type QueryPlantRequirementArgs = {
  plantId: Scalars['ID']['input'];
};


export type QueryPlantStatusReportArgs = {
  id: Scalars['ID']['input'];
  plantId: Scalars['ID']['input'];
};


export type QueryPlantStatusReportPhotosArgs = {
  plantId: Scalars['ID']['input'];
  statusReportId: Scalars['ID']['input'];
};


export type QueryPlantStatusReportsArgs = {
  plantId: Scalars['ID']['input'];
};


export type QueryRoomArgs = {
  id: Scalars['ID']['input'];
};

export type RoomCountModel = {
  __typename?: 'RoomCountModel';
  plants: Scalars['Int']['output'];
};

export type RoomModel = {
  __typename?: 'RoomModel';
  _count?: Maybe<RoomCountModel>;
  averageTemperature?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  humidityLevel?: Maybe<HumidityLevel>;
  id: Scalars['ID']['output'];
  lightLevel?: Maybe<LightLevel>;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  orientation?: Maybe<RoomOrientation>;
  ownerUserId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum RoomOrientation {
  East = 'east',
  Mixed = 'mixed',
  North = 'north',
  South = 'south',
  West = 'west'
}

export type UpdatePlantDto = {
  acquiredAt?: InputMaybe<Scalars['DateTime']['input']>;
  acquiredFrom?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  locationDescription?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  potSizeCm?: InputMaybe<Scalars['Int']['input']>;
  roomId?: InputMaybe<Scalars['ID']['input']>;
  size?: InputMaybe<PlantSize>;
  species?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<PlantStatus>;
};

export type UpdatePlantEventDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  eventDate?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<PlantEventType>;
};

export type UpdatePlantStatusReportDto = {
  aiRecommendations?: InputMaybe<Scalars['String']['input']>;
  aiSummary?: InputMaybe<Scalars['String']['input']>;
  growthStatus?: InputMaybe<Scalars['String']['input']>;
  leafStatus?: InputMaybe<Scalars['String']['input']>;
  lightAssessment?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  overallStatus?: InputMaybe<OverallStatus>;
  pestSuspicion?: InputMaybe<PestSuspicion>;
  reportMonth?: InputMaybe<Scalars['String']['input']>;
  soilStatus?: InputMaybe<Scalars['String']['input']>;
  wateringAssessment?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRoomDto = {
  averageTemperature?: InputMaybe<Scalars['String']['input']>;
  humidityLevel?: InputMaybe<HumidityLevel>;
  lightLevel?: InputMaybe<LightLevel>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  orientation?: InputMaybe<RoomOrientation>;
};

export type UpdateUserEnabledInput = {
  id: Scalars['ID']['input'];
  isEnabled: Scalars['Boolean']['input'];
};

export type UpsertPlantRequirementDto = {
  commonProblems?: InputMaybe<Scalars['String']['input']>;
  fertilizingNeed?: InputMaybe<Scalars['String']['input']>;
  humidityNeed?: InputMaybe<Scalars['String']['input']>;
  lightNeed?: InputMaybe<Scalars['String']['input']>;
  repottingFrequency?: InputMaybe<Scalars['String']['input']>;
  soilNeed?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  temperatureNeed?: InputMaybe<Scalars['String']['input']>;
  toxicity?: InputMaybe<Scalars['String']['input']>;
  waterNeed?: InputMaybe<Scalars['String']['input']>;
};

export type UserModel = {
  __typename?: 'UserModel';
  displayName?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isAdmin: Scalars['Boolean']['output'];
  isEnabled: Scalars['Boolean']['output'];
};

export type ApiStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type ApiStatusQuery = { __typename?: 'Query', apiStatus: string };


export const ApiStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ApiStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiStatus"}}]}}]} as unknown as DocumentNode<ApiStatusQuery, ApiStatusQueryVariables>;