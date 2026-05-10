import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Field, SelectInput, TextArea, TextInput } from "../components/ui/Field";
import { api, type Room } from "../lib/api";
import { emptyToUndefined } from "../lib/format";
import { humidityLabels, lightLabels, orientationLabels } from "../lib/labels";
import { useAsyncData } from "../lib/useAsyncData";

const roomSchema = z.object({
  name: z.string().trim().min(1, "A név kötelező.").max(120),
  orientation: z.enum(["", "north", "south", "east", "west", "mixed"]),
  lightLevel: z.enum(["", "low", "medium", "high"]),
  humidityLevel: z.enum(["", "low", "normal", "high"]),
  averageTemperature: z.string().max(80).optional(),
  notes: z.string().optional()
});

type RoomFormState = z.infer<typeof roomSchema>;

const emptyRoom: RoomFormState = {
  name: "",
  orientation: "",
  lightLevel: "",
  humidityLevel: "",
  averageTemperature: "",
  notes: ""
};

export function RoomsPage() {
  const rooms = useAsyncData(() => api.getRooms(), []);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [form, setForm] = useState<RoomFormState>(emptyRoom);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function startEdit(room: Room) {
    setEditingRoom(room);
    setForm({
      name: room.name,
      orientation: room.orientation ?? "",
      lightLevel: room.lightLevel ?? "",
      humidityLevel: room.humidityLevel ?? "",
      averageTemperature: room.averageTemperature ?? "",
      notes: room.notes ?? ""
    });
  }

  function resetForm() {
    setEditingRoom(null);
    setForm(emptyRoom);
    setError(null);
  }

  async function saveRoom() {
    setError(null);
    const parsed = roomSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Érvénytelen űrlap.");
      return;
    }

    const payload = {
      name: parsed.data.name.trim(),
      orientation: parsed.data.orientation || undefined,
      lightLevel: parsed.data.lightLevel || undefined,
      humidityLevel: parsed.data.humidityLevel || undefined,
      averageTemperature: emptyToUndefined(parsed.data.averageTemperature),
      notes: emptyToUndefined(parsed.data.notes)
    };

    setIsSaving(true);
    try {
      if (editingRoom) {
        await api.updateRoom(editingRoom.id, payload);
      } else {
        await api.createRoom(payload);
      }
      await rooms.reload();
      resetForm();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Mentési hiba.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteRoom(room: Room) {
    if (!window.confirm(`Biztosan törlöd ezt a helyiséget: ${room.name}?`)) return;
    await api.deleteRoom(room.id);
    await rooms.reload();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="grid gap-4">
        <div>
          <p className="text-sm font-medium text-muted">Step 2</p>
          <h2 className="text-2xl font-semibold">Helyiségek</h2>
        </div>
        {rooms.isLoading ? <Card>Helyiségek betöltése...</Card> : null}
        {rooms.error ? <Card className="text-red-700">{rooms.error}</Card> : null}
        {rooms.data?.length === 0 ? (
          <EmptyState title="Még nincs helyiség" description="Rögzítsd, hol vannak a növények." />
        ) : null}
        <div className="grid gap-3 md:grid-cols-2">
          {rooms.data?.map((room) => (
            <Card key={room.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{room.name}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {room.orientation ? orientationLabels[room.orientation] : "Tájolás nélkül"} ·{" "}
                    {room.lightLevel ? lightLabels[room.lightLevel] : "Fény nincs megadva"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    aria-label="Helyiség szerkesztése"
                    variant="ghost"
                    icon={<Pencil className="h-4 w-4" />}
                    onClick={() => startEdit(room)}
                  />
                  <Button
                    aria-label="Helyiség törlése"
                    variant="ghost"
                    icon={<Trash2 className="h-4 w-4" />}
                    onClick={() => void deleteRoom(room)}
                  />
                </div>
              </div>
              <dl className="mt-4 grid gap-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Pára</dt>
                  <dd>{room.humidityLevel ? humidityLabels[room.humidityLevel] : "Nincs megadva"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Hőmérséklet</dt>
                  <dd>{room.averageTemperature ?? "Nincs megadva"}</dd>
                </div>
              </dl>
              {room.notes ? <p className="mt-3 text-sm text-muted">{room.notes}</p> : null}
            </Card>
          ))}
        </div>
      </section>

      <aside>
        <Card className="sticky top-4">
          <h3 className="text-lg font-semibold">
            {editingRoom ? "Helyiség szerkesztése" : "Új helyiség"}
          </h3>
          <div className="mt-4 grid gap-3">
            <Field label="Név">
              <TextInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </Field>
            <Field label="Tájolás">
              <SelectInput
                value={form.orientation}
                onChange={(event) => setForm({ ...form, orientation: event.target.value as RoomFormState["orientation"] })}
              >
                <option value="">Nincs megadva</option>
                {Object.entries(orientationLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Fény">
              <SelectInput
                value={form.lightLevel}
                onChange={(event) => setForm({ ...form, lightLevel: event.target.value as RoomFormState["lightLevel"] })}
              >
                <option value="">Nincs megadva</option>
                {Object.entries(lightLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Páratartalom">
              <SelectInput
                value={form.humidityLevel}
                onChange={(event) => setForm({ ...form, humidityLevel: event.target.value as RoomFormState["humidityLevel"] })}
              >
                <option value="">Nincs megadva</option>
                {Object.entries(humidityLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Átlaghőmérséklet">
              <TextInput
                value={form.averageTemperature}
                placeholder="21-24 °C"
                onChange={(event) => setForm({ ...form, averageTemperature: event.target.value })}
              />
            </Field>
            <Field label="Megjegyzés">
              <TextArea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
            </Field>
            {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
            <div className="flex gap-2">
              <Button icon={<Plus className="h-4 w-4" />} onClick={() => void saveRoom()} disabled={isSaving}>
                Mentés
              </Button>
              {editingRoom ? <Button variant="secondary" onClick={resetForm}>Mégse</Button> : null}
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}
