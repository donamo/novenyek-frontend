import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarPlus, Camera, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field, SelectInput, TextArea, TextInput } from "../components/ui/Field";
import { StatusPill } from "../components/ui/StatusPill";
import {
  api,
  type EventType,
  type OverallStatus,
  type PestSuspicion,
  type PlantRequirement,
  type PlantSize,
  type PlantStatus
} from "../lib/api";
import { emptyToUndefined, formatDate, formatMonth } from "../lib/format";
import { optimizeImage } from "../lib/images";
import {
  eventTypeLabels,
  overallStatusLabels,
  pestSuspicionLabels,
  plantSizeLabels,
  plantStatusLabels
} from "../lib/labels";
import { useAsyncData } from "../lib/useAsyncData";

const requirementFields: Array<[keyof PlantRequirement, string]> = [
  ["lightNeed", "Fényigény"],
  ["waterNeed", "Vízigény"],
  ["humidityNeed", "Páraigény"],
  ["temperatureNeed", "Hőmérséklet"],
  ["soilNeed", "Talaj"],
  ["fertilizingNeed", "Tápoldatozás"],
  ["repottingFrequency", "Átültetés gyakorisága"],
  ["commonProblems", "Gyakori problémák"],
  ["toxicity", "Toxicitás"],
  ["source", "Forrás"]
];

const today = new Date().toISOString().slice(0, 10);
const currentMonth = new Date().toISOString().slice(0, 7);

const emptyPlantForm = {
  name: "",
  nickname: "",
  species: "",
  category: "",
  size: "" as "" | PlantSize,
  potSizeCm: "",
  roomId: "",
  locationDescription: "",
  acquiredAt: "",
  acquiredFrom: "",
  status: "active" as PlantStatus,
  notes: ""
};

export function PlantDetailPage() {
  const params = useParams<{ plantId: string }>();
  const plantId = params.plantId ?? "";

  const plant = useAsyncData(() => api.getPlant(plantId), [plantId]);
  const requirements = useAsyncData(() => api.getPlantRequirements(plantId), [plantId]);
  const events = useAsyncData(() => api.getPlantEvents(plantId), [plantId]);
  const reports = useAsyncData(() => api.getStatusReports(plantId), [plantId]);
  const photos = useAsyncData(() => api.getPhotos(plantId), [plantId]);
  const rooms = useAsyncData(() => api.getRooms(), []);

  const [plantForm, setPlantForm] = useState(emptyPlantForm);
  const [requirementForm, setRequirementForm] = useState<PlantRequirement>({});
  const [eventForm, setEventForm] = useState({
    type: "note" as EventType,
    eventDate: today,
    title: "",
    description: ""
  });
  const [reportForm, setReportForm] = useState({
    reportMonth: currentMonth,
    overallStatus: "unknown" as OverallStatus,
    leafStatus: "",
    growthStatus: "",
    soilStatus: "",
    pestSuspicion: "unknown" as PestSuspicion,
    wateringAssessment: "",
    lightAssessment: "",
    notes: ""
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const latestReport = useMemo(() => {
    return [...(reports.data ?? [])].sort((a, b) => b.reportMonth.localeCompare(a.reportMonth))[0];
  }, [reports.data]);

  useEffect(() => {
    if (requirements.data) setRequirementForm(requirements.data);
  }, [requirements.data]);

  useEffect(() => {
    if (!plant.data) return;
    setPlantForm({
      name: plant.data.name ?? "",
      nickname: plant.data.nickname ?? "",
      species: plant.data.species ?? "",
      category: plant.data.category ?? "",
      size: plant.data.size ?? "",
      potSizeCm: plant.data.potSizeCm ? String(plant.data.potSizeCm) : "",
      roomId: plant.data.roomId ?? "",
      locationDescription: plant.data.locationDescription ?? "",
      acquiredAt: plant.data.acquiredAt?.slice(0, 10) ?? "",
      acquiredFrom: plant.data.acquiredFrom ?? "",
      status: plant.data.status ?? "active",
      notes: plant.data.notes ?? ""
    });
  }, [plant.data]);

  if (!plantId) return <Card>Hiányzó növény azonosító.</Card>;

  async function savePlantDetails() {
    setMessage(null);
    if (!plantForm.name.trim()) {
      setMessage("A növény neve kötelező.");
      return;
    }

    await api.updatePlant(plantId, {
      name: plantForm.name.trim(),
      nickname: emptyToUndefined(plantForm.nickname),
      species: emptyToUndefined(plantForm.species),
      category: emptyToUndefined(plantForm.category),
      size: plantForm.size || undefined,
      potSizeCm: plantForm.potSizeCm ? Number(plantForm.potSizeCm) : undefined,
      roomId: emptyToUndefined(plantForm.roomId),
      locationDescription: emptyToUndefined(plantForm.locationDescription),
      acquiredAt: emptyToUndefined(plantForm.acquiredAt),
      acquiredFrom: emptyToUndefined(plantForm.acquiredFrom),
      status: plantForm.status,
      notes: emptyToUndefined(plantForm.notes)
    });
    await plant.reload();
    setMessage("Alapadatok mentve.");
  }

  async function saveRequirements() {
    setMessage(null);
    const payload = Object.fromEntries(
      requirementFields.map(([key]) => [key, emptyToUndefined(requirementForm[key] as string | undefined)])
    ) as PlantRequirement;
    await api.savePlantRequirements(plantId, payload);
    await requirements.reload();
    setMessage("Igények mentve.");
  }

  async function createEvent() {
    setMessage(null);
    if (!eventForm.title.trim()) {
      setMessage("Az esemény címe kötelező.");
      return;
    }
    await api.createPlantEvent(plantId, {
      type: eventForm.type,
      eventDate: eventForm.eventDate,
      title: eventForm.title.trim(),
      description: emptyToUndefined(eventForm.description)
    });
    setEventForm({ type: "note", eventDate: today, title: "", description: "" });
    await events.reload();
    setMessage("Esemény rögzítve.");
  }

  async function createReport() {
    setMessage(null);
    await api.createStatusReport(plantId, {
      reportMonth: reportForm.reportMonth,
      overallStatus: reportForm.overallStatus,
      leafStatus: emptyToUndefined(reportForm.leafStatus),
      growthStatus: emptyToUndefined(reportForm.growthStatus),
      soilStatus: emptyToUndefined(reportForm.soilStatus),
      pestSuspicion: reportForm.pestSuspicion,
      wateringAssessment: emptyToUndefined(reportForm.wateringAssessment),
      lightAssessment: emptyToUndefined(reportForm.lightAssessment),
      notes: emptyToUndefined(reportForm.notes)
    });
    await reports.reload();
    setMessage("Havi státusz mentve.");
  }

  async function uploadPhoto(file?: File) {
    if (!file) return;
    setMessage(null);
    setIsUploading(true);
    try {
      const optimized = await optimizeImage(file);
      await api.uploadPhoto(plantId, optimized, {
        filename: `${file.name.replace(/\.[^.]+$/, "") || "plant-photo"}.jpg`,
        statusReportId: latestReport?.id,
        takenAt: today
      });
      await photos.reload();
      await events.reload();
      setMessage("Fotó feltöltve.");
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Fotófeltöltési hiba.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link to="/plants" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-leaf-700">
            <ArrowLeft className="h-4 w-4" />
            Vissza a növényekhez
          </Link>
          <h2 className="mt-3 text-2xl font-semibold">{plant.data?.name ?? "Növény adatlap"}</h2>
          <p className="mt-1 text-sm text-muted">{plant.data?.species ?? plant.data?.nickname ?? "Faj nincs megadva"}</p>
        </div>
        <StatusPill
          value={plant.data?.status ?? "active"}
          label={plantStatusLabels[plant.data?.status ?? "active"]}
        />
      </div>

      {message ? <Card className="border-leaf-100 bg-leaf-50 text-sm font-medium text-leaf-700">{message}</Card> : null}
      {plant.error ? <Card className="text-red-700">{plant.error}</Card> : null}

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <h3 className="text-lg font-semibold">Alapadatok</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Field label="Név">
              <TextInput value={plantForm.name} onChange={(event) => setPlantForm({ ...plantForm, name: event.target.value })} />
            </Field>
            <Field label="Becenév">
              <TextInput value={plantForm.nickname} onChange={(event) => setPlantForm({ ...plantForm, nickname: event.target.value })} />
            </Field>
            <Field label="Faj">
              <TextInput value={plantForm.species} onChange={(event) => setPlantForm({ ...plantForm, species: event.target.value })} />
            </Field>
            <Field label="Kategória">
              <TextInput value={plantForm.category} onChange={(event) => setPlantForm({ ...plantForm, category: event.target.value })} />
            </Field>
            <Field label="Méret">
              <SelectInput value={plantForm.size} onChange={(event) => setPlantForm({ ...plantForm, size: event.target.value as "" | PlantSize })}>
                <option value="">Nincs megadva</option>
                {Object.entries(plantSizeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Cserépméret (cm)">
              <TextInput
                type="number"
                min="1"
                max="200"
                value={plantForm.potSizeCm}
                onChange={(event) => setPlantForm({ ...plantForm, potSizeCm: event.target.value })}
              />
            </Field>
            <Field label="Állapot">
              <SelectInput value={plantForm.status} onChange={(event) => setPlantForm({ ...plantForm, status: event.target.value as PlantStatus })}>
                {Object.entries(plantStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Helyiség">
              <SelectInput value={plantForm.roomId} onChange={(event) => setPlantForm({ ...plantForm, roomId: event.target.value })}>
                <option value="">Nincs helyiség</option>
                {rooms.data?.map((room) => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Pontos hely">
              <TextInput value={plantForm.locationDescription} onChange={(event) => setPlantForm({ ...plantForm, locationDescription: event.target.value })} />
            </Field>
            <Field label="Beszerzés dátuma">
              <TextInput type="date" value={plantForm.acquiredAt} onChange={(event) => setPlantForm({ ...plantForm, acquiredAt: event.target.value })} />
            </Field>
            <Field label="Beszerzés helye">
              <TextInput value={plantForm.acquiredFrom} onChange={(event) => setPlantForm({ ...plantForm, acquiredFrom: event.target.value })} />
            </Field>
            <Field label="Megjegyzés">
              <TextArea value={plantForm.notes} onChange={(event) => setPlantForm({ ...plantForm, notes: event.target.value })} />
            </Field>
          </div>
          <Button className="mt-4" icon={<Save className="h-4 w-4" />} onClick={() => void savePlantDetails()}>
            Alapadatok mentése
          </Button>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold">Legutóbbi havi státusz</h3>
          {latestReport ? (
            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">{formatMonth(latestReport.reportMonth)}</span>
                <StatusPill
                  value={latestReport.overallStatus ?? "unknown"}
                  label={overallStatusLabels[latestReport.overallStatus ?? "unknown"]}
                />
              </div>
              <p>{latestReport.notes ?? latestReport.leafStatus ?? "Nincs részletes megjegyzés."}</p>
              {latestReport.aiSummary ? <p className="text-muted">AI: {latestReport.aiSummary}</p> : null}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Ehhez a növényhez még nincs havi státusz.</p>
          )}
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <h3 className="text-lg font-semibold">Gondozási igények</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {requirementFields.map(([key, label]) => (
              <Field key={key} label={label}>
                <TextArea
                  value={(requirementForm[key] as string | undefined) ?? ""}
                  onChange={(event) => setRequirementForm({ ...requirementForm, [key]: event.target.value })}
                />
              </Field>
            ))}
          </div>
          <Button className="mt-4" icon={<Save className="h-4 w-4" />} onClick={() => void saveRequirements()}>
            Igények mentése
          </Button>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold">Új esemény</h3>
          <div className="mt-4 grid gap-3">
            <Field label="Típus">
              <SelectInput
                value={eventForm.type}
                onChange={(event) => setEventForm({ ...eventForm, type: event.target.value as EventType })}
              >
                {Object.entries(eventTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Dátum">
              <TextInput type="date" value={eventForm.eventDate} onChange={(event) => setEventForm({ ...eventForm, eventDate: event.target.value })} />
            </Field>
            <Field label="Cím">
              <TextInput value={eventForm.title} onChange={(event) => setEventForm({ ...eventForm, title: event.target.value })} />
            </Field>
            <Field label="Leírás">
              <TextArea value={eventForm.description} onChange={(event) => setEventForm({ ...eventForm, description: event.target.value })} />
            </Field>
            <Button icon={<CalendarPlus className="h-4 w-4" />} onClick={() => void createEvent()}>
              Esemény mentése
            </Button>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card>
          <h3 className="text-lg font-semibold">Havi státusz</h3>
          <div className="mt-4 grid gap-3">
            <Field label="Hónap">
              <TextInput type="month" value={reportForm.reportMonth} onChange={(event) => setReportForm({ ...reportForm, reportMonth: event.target.value })} />
            </Field>
            <Field label="Általános állapot">
              <SelectInput
                value={reportForm.overallStatus}
                onChange={(event) => setReportForm({ ...reportForm, overallStatus: event.target.value as OverallStatus })}
              >
                {Object.entries(overallStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Kártevő gyanú">
              <SelectInput
                value={reportForm.pestSuspicion}
                onChange={(event) => setReportForm({ ...reportForm, pestSuspicion: event.target.value as PestSuspicion })}
              >
                {Object.entries(pestSuspicionLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Levél állapota">
              <TextArea value={reportForm.leafStatus} onChange={(event) => setReportForm({ ...reportForm, leafStatus: event.target.value })} />
            </Field>
            <Field label="Növekedés">
              <TextArea value={reportForm.growthStatus} onChange={(event) => setReportForm({ ...reportForm, growthStatus: event.target.value })} />
            </Field>
            <Field label="Föld állapota">
              <TextArea value={reportForm.soilStatus} onChange={(event) => setReportForm({ ...reportForm, soilStatus: event.target.value })} />
            </Field>
            <Field label="Öntözés értékelése">
              <TextArea value={reportForm.wateringAssessment} onChange={(event) => setReportForm({ ...reportForm, wateringAssessment: event.target.value })} />
            </Field>
            <Field label="Fény értékelése">
              <TextArea value={reportForm.lightAssessment} onChange={(event) => setReportForm({ ...reportForm, lightAssessment: event.target.value })} />
            </Field>
            <Field label="Megjegyzés">
              <TextArea value={reportForm.notes} onChange={(event) => setReportForm({ ...reportForm, notes: event.target.value })} />
            </Field>
            <Button icon={<Save className="h-4 w-4" />} onClick={() => void createReport()}>
              Státusz mentése
            </Button>
          </div>
        </Card>

        <div className="grid gap-4">
          <Card>
            <h3 className="text-lg font-semibold">Fotók</h3>
            <div className="mt-4 rounded-md border border-dashed border-border p-4">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center text-sm text-muted">
                <Camera className="h-6 w-6 text-leaf-700" />
                {isUploading ? "Fotó feltöltése..." : "Fotó készítése vagy feltöltése"}
                <input
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  disabled={isUploading}
                  onChange={(event) => void uploadPhoto(event.target.files?.[0])}
                />
              </label>
            </div>
            <p className="mt-3 text-sm text-muted">
              Feltöltés előtt a kép legfeljebb 1280 px hosszú oldalra és JPEG formátumra lesz optimalizálva.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {photos.data?.map((photo) => {
                const imageUrl = api.getAssetUrl(photo.thumbnailPath ?? photo.filePath);
                const fullImageUrl = api.getAssetUrl(photo.filePath);
                return (
                  <a
                    key={photo.id}
                    className="overflow-hidden rounded-md border border-border text-sm transition hover:border-leaf-200 hover:shadow-sm"
                    href={fullImageUrl ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={photo.caption ?? photo.originalFilename ?? "Növény fotó"}
                        className="aspect-square w-full bg-leaf-50 object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex aspect-square w-full items-center justify-center bg-leaf-50 text-muted">
                        Nincs kép
                      </div>
                    )}
                    <div className="p-3">
                      <p className="truncate font-medium">{photo.caption ?? photo.originalFilename ?? "Fotó"}</p>
                      <p className="mt-1 text-muted">{formatDate(photo.uploadedAt)}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold">History</h3>
            <div className="mt-4 grid gap-3">
              {events.data?.length === 0 ? <p className="text-sm text-muted">Még nincs esemény.</p> : null}
              {events.data?.map((event) => (
                <div key={event.id} className="rounded-md border border-border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">{event.title}</p>
                    <span className="text-sm text-muted">{formatDate(event.eventDate)}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{eventTypeLabels[event.type]}</p>
                  {event.description ? <p className="mt-2 text-sm">{event.description}</p> : null}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
