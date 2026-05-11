import { Link } from "react-router-dom";
import { Camera, Leaf, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Field, SelectInput, TextArea, TextInput } from "../components/ui/Field";
import { StatusPill } from "../components/ui/StatusPill";
import { api, type Plant } from "../lib/api";
import { emptyToUndefined } from "../lib/format";
import { optimizeImage } from "../lib/images";
import { plantSizeLabels, plantStatusLabels } from "../lib/labels";
import { useAsyncData } from "../lib/useAsyncData";

const plantSchema = z.object({
  name: z.string().trim().max(160).optional(),
  nickname: z.string().optional(),
  species: z.string().optional(),
  category: z.string().optional(),
  size: z.enum(["", "small", "medium", "large"]),
  potSizeCm: z.string().optional(),
  roomId: z.string().optional(),
  locationDescription: z.string().optional(),
  acquiredAt: z.string().optional(),
  acquiredFrom: z.string().optional(),
  status: z.enum(["active", "inactive", "dead", "gifted"]),
  notes: z.string().optional()
});

type PlantFormState = z.infer<typeof plantSchema>;

const emptyPlant: PlantFormState = {
  name: "",
  nickname: "",
  species: "",
  category: "",
  size: "",
  potSizeCm: "",
  roomId: "",
  locationDescription: "",
  acquiredAt: "",
  acquiredFrom: "",
  status: "active",
  notes: ""
};

export function PlantsPage() {
  const plants = useAsyncData(() => api.getPlants(), []);
  const rooms = useAsyncData(() => api.getRooms(), []);
  const [query, setQuery] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState<PlantFormState>(emptyPlant);
  const [plantPhoto, setPlantPhoto] = useState<File | null>(null);
  const [plantPhotoPreview, setPlantPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const roomById = useMemo(
    () => new Map((rooms.data ?? []).map((room) => [room.id, room])),
    [rooms.data]
  );

  const filteredPlants = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("hu-HU");
    return (plants.data ?? []).filter((plant) => {
      const matchesQuery =
        !normalizedQuery ||
        [plant.name, plant.nickname, plant.species, plant.category]
          .filter(Boolean)
          .some((value) => value!.toLocaleLowerCase("hu-HU").includes(normalizedQuery));
      const matchesRoom = !roomFilter || plant.roomId === roomFilter;
      const matchesStatus = !statusFilter || plant.status === statusFilter;
      return matchesQuery && matchesRoom && matchesStatus;
    });
  }, [plants.data, query, roomFilter, statusFilter]);

  useEffect(() => {
    if (!plantPhoto) {
      setPlantPhotoPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(plantPhoto);
    setPlantPhotoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [plantPhoto]);

  function selectPlantPhoto(file?: File) {
    if (!file) return;
    setPlantPhoto(file);
    setError(null);
    if (!form.name?.trim()) {
      const inferredName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
      if (inferredName) setForm({ ...form, name: inferredName });
    }
  }

  async function createPlant() {
    setError(null);
    const parsed = plantSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Érvénytelen növényadatok.");
      return;
    }
    if (!plantPhoto && !parsed.data.name?.trim()) {
      setError("A név kötelező, ha nem fotóból indítod a növény létrehozását.");
      return;
    }

    const potSizeCm = parsed.data.potSizeCm ? Number(parsed.data.potSizeCm) : undefined;
    const payload = {
      name: emptyToUndefined(parsed.data.name),
      nickname: emptyToUndefined(parsed.data.nickname),
      species: emptyToUndefined(parsed.data.species),
      category: emptyToUndefined(parsed.data.category),
      size: parsed.data.size || undefined,
      potSizeCm,
      roomId: emptyToUndefined(parsed.data.roomId),
      locationDescription: emptyToUndefined(parsed.data.locationDescription),
      acquiredAt: emptyToUndefined(parsed.data.acquiredAt),
      acquiredFrom: emptyToUndefined(parsed.data.acquiredFrom),
      status: parsed.data.status,
      notes: emptyToUndefined(parsed.data.notes)
    };

    setIsSaving(true);
    try {
      if (plantPhoto) {
        const optimized = await optimizeImage(plantPhoto);
        await api.createPlantFromPhoto(payload, optimized, {
          filename: `${plantPhoto.name.replace(/\.[^.]+$/, "") || "plant-photo"}.jpg`,
          caption: "Kezdő fotó"
        });
      } else {
        await api.createPlant(payload);
      }
      await plants.reload();
      setForm(emptyPlant);
      setPlantPhoto(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Mentési hiba.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deletePlant(plant: Plant) {
    if (!window.confirm(`Biztosan törlöd ezt a növényt: ${plant.name}?`)) return;
    await api.deletePlant(plant.id);
    await plants.reload();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="grid gap-4">
        <div>
          <p className="text-sm font-medium text-muted">Step 3</p>
          <h2 className="text-2xl font-semibold">Növények</h2>
        </div>
        <Card className="grid gap-3 md:grid-cols-[1fr_220px_180px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" />
            <TextInput
              className="w-full pl-9"
              placeholder="Keresés név, faj vagy kategória alapján"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <SelectInput value={roomFilter} onChange={(event) => setRoomFilter(event.target.value)}>
            <option value="">Minden helyiség</option>
            {rooms.data?.map((room) => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </SelectInput>
          <SelectInput value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">Minden állapot</option>
            {Object.entries(plantStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </SelectInput>
        </Card>

        {plants.isLoading ? <Card>Növények betöltése...</Card> : null}
        {plants.error ? <Card className="text-red-700">{plants.error}</Card> : null}
        {!plants.isLoading && filteredPlants.length === 0 ? (
          <EmptyState title="Nincs találat" description="Hozz létre új növényt, vagy módosítsd a szűrőket." />
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          {filteredPlants.map((plant) => {
            const room = plant.room ?? (plant.roomId ? roomById.get(plant.roomId) : undefined);
            return (
              <Card key={plant.id}>
                <div className="flex items-start gap-3">
                  <Link
                    to={`/plants/${plant.id}`}
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-leaf-50 text-leaf-700"
                    aria-label={`${plant.name} adatlap`}
                  >
                    <Leaf className="h-7 w-7" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link to={`/plants/${plant.id}`} className="font-semibold hover:text-leaf-700">
                          {plant.name}
                        </Link>
                        <p className="truncate text-sm text-muted">
                          {plant.species || plant.nickname || "Faj nincs megadva"}
                        </p>
                      </div>
                      <Button
                        aria-label="Növény törlése"
                        variant="ghost"
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => void deletePlant(plant)}
                      />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <StatusPill value={plant.status ?? "active"} label={plantStatusLabels[plant.status ?? "active"]} />
                      {plant.size ? <StatusPill value="unknown" label={plantSizeLabels[plant.size]} /> : null}
                    </div>
                    <p className="mt-3 text-sm text-muted">
                      Hely: {room?.name ?? "Nincs helyiség"}{plant.locationDescription ? `, ${plant.locationDescription}` : ""}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <aside>
        <Card className="sticky top-4">
          <h3 className="text-lg font-semibold">Új növény</h3>
          <div className="mt-4 grid gap-3">
            <div className="rounded-md border border-dashed border-border p-3">
              {plantPhotoPreview ? (
                <div className="grid gap-3">
                  <img
                    src={plantPhotoPreview}
                    alt="Új növény fotó előnézete"
                    className="aspect-[4/3] w-full rounded-md object-cover"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm text-muted">{plantPhoto?.name}</p>
                    <Button
                      aria-label="Kiválasztott fotó eltávolítása"
                      variant="ghost"
                      icon={<X className="h-4 w-4" />}
                      onClick={() => setPlantPhoto(null)}
                      type="button"
                    />
                  </div>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center text-sm text-muted">
                  <Camera className="h-6 w-6 text-leaf-700" />
                  Fotó készítése vagy feltöltése
                  <input
                    className="sr-only"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    disabled={isSaving}
                    onChange={(event) => selectPlantPhoto(event.target.files?.[0])}
                  />
                </label>
              )}
            </div>
            <Field label="Név">
              <TextInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Field label="Becenév">
                <TextInput value={form.nickname} onChange={(event) => setForm({ ...form, nickname: event.target.value })} />
              </Field>
              <Field label="Faj">
                <TextInput value={form.species} onChange={(event) => setForm({ ...form, species: event.target.value })} />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Field label="Kategória">
                <TextInput value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
              </Field>
              <Field label="Méret">
                <SelectInput value={form.size} onChange={(event) => setForm({ ...form, size: event.target.value as PlantFormState["size"] })}>
                  <option value="">Nincs megadva</option>
                  {Object.entries(plantSizeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </SelectInput>
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Field label="Cserépméret (cm)">
                <TextInput type="number" min="1" max="200" value={form.potSizeCm} onChange={(event) => setForm({ ...form, potSizeCm: event.target.value })} />
              </Field>
              <Field label="Állapot">
                <SelectInput value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as PlantFormState["status"] })}>
                  {Object.entries(plantStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </SelectInput>
              </Field>
            </div>
            <Field label="Helyiség">
              <SelectInput value={form.roomId} onChange={(event) => setForm({ ...form, roomId: event.target.value })}>
                <option value="">Nincs helyiség</option>
                {rooms.data?.map((room) => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Pontos hely">
              <TextInput value={form.locationDescription} onChange={(event) => setForm({ ...form, locationDescription: event.target.value })} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Field label="Beszerzés dátuma">
                <TextInput type="date" value={form.acquiredAt} onChange={(event) => setForm({ ...form, acquiredAt: event.target.value })} />
              </Field>
              <Field label="Beszerzés helye">
                <TextInput value={form.acquiredFrom} onChange={(event) => setForm({ ...form, acquiredFrom: event.target.value })} />
              </Field>
            </div>
            <Field label="Megjegyzés">
              <TextArea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
            </Field>
            {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
            <Button icon={<Plus className="h-4 w-4" />} onClick={() => void createPlant()} disabled={isSaving}>
              Növény mentése
            </Button>
          </div>
        </Card>
      </aside>
    </div>
  );
}
