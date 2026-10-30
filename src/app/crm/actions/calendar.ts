"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/crm/auth";
import { addActivity } from "@/lib/events";
import { scheduleCalendarSync } from "@/lib/google-calendar";

export async function createEvent(fd: FormData) {
  const s = await getSession();
  scheduleCalendarSync();
  const date = String(fd.get("date"));
  const time = String(fd.get("time") || "");
  const allDay = !time;
  const start = new Date(`${date}T${time || "09:00"}:00`);
  const duration = Number(fd.get("duration") || 60);
  const clientId = String(fd.get("client_id") || "") || null;
  const { error } = await s.sb.from("events").insert({
    title: String(fd.get("title") || "Eveniment"),
    type: String(fd.get("type") || "intalnire"),
    start_at: start.toISOString(),
    end_at: allDay ? null : new Date(start.getTime() + duration * 60000).toISOString(),
    all_day: allDay,
    client_id: clientId,
    project_id: String(fd.get("project_id") || "") || null,
    location: String(fd.get("location") || "") || null,
    description: String(fd.get("description") || "") || null,
    created_by: s.userId,
  });
  if (error) throw new Error(error.message);
  if (clientId) await addActivity(s.sb, { client_id: clientId, type: "intalnire", title: `Programat: ${String(fd.get("title"))}`, description: start.toLocaleString("ro-RO"), actor_id: s.userId });
  revalidatePath("/crm/calendar");
}

export async function deleteEvent(fd: FormData) {
  const s = await getSession();
  scheduleCalendarSync();
  await s.sb.from("events").delete().eq("id", String(fd.get("id")));
  revalidatePath("/crm/calendar");
}
