import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarPlus, Camera, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field, SelectInput, TextArea, TextInput } from "../components/ui/Field";
import { StatusPill } from "../components/ui/StatusPill";
import { api, type EventType, type OverallStatus, type PestSuspicion, type PlantRequirement } from "../lib/api";
import { emptyToUndefined, formatDate, formatMonth } from "../lib/format";
import { optimizeImage } from "../lib/images";
import { eventTypeLabels, overallStatusLabels, pestSuspicionLabels, plantStatusLabels } from "../lib/labels";
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

export function PlantDetailPage() {
  const params = useParams<{ plantId: string }>();
  const plantId = params.plantId ?? "";

  const plant = useAsyncData(() => api.getPlant(plantId), [plantId]);
  const requirements = useAsyncData(() => api.getPlantRequirements(plantId), [plantId]);
  const events = useAsyncData(() => api.getPlantEvents(plantId), [plantId]);
  const reports = useAsyncData(() => api.getStatusReports(plantId), [plantId]);
  const photos = useAsyncData(() => api.getPhotos(plantId), [plantId]);

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

  if (!plantId) return <Card>Hiányzó növény azonosító.</Card>;

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
          <dl className="mt-4 grid gap-3 text-sm">
            <Row label="Becenév" value={plant.data?.nickname} />
            <Row label="Kategória" value={plant.data?.category} />
            <Row label="Cserép" value={plant.data?.potSizeCm ? `${plant.data.potSizeCm} cm` : undefined} />
            <Row label="Beszerzés" value={plant.data?.acquiredAt ? formatDate(plant.data.acquiredAt) : undefined} />
            <Row label="Forrás" value={plant.data?.acquiredFrom} />
            <Row label="Pontos hely" value={plant.data?.locationDescription} />
          </dl>
          {plant.data?.notes ? <p className="mt-4 text-sm text-muted">{plant.data.notes}</p> : null}
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
              {photos.data?.map((photo) => (
                <div key={photo.id} className="rounded-md border border-border p-3 text-sm">
                  <p className="font-medium">{photo.caption ?? "Fotó"}</p>
                  <p className="mt-1 text-muted">{formatDate(photo.uploadedAt)}</p>
                </div>
              ))}
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

function Row({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right">{value ?? "Nincs megadva"}</dd>
    </div>
  );
}
