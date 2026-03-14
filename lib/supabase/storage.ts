import type { SupabaseClient } from "@supabase/supabase-js";

export type MediaItem = {
  name: string;
  path: string;
  url: string;
  size: number;
  created_at: string;
};

const BUCKET = "media";
const FOLDER = "images";

export function getPublicUrl(supabase: SupabaseClient, path: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadMedia(
  supabase: SupabaseClient,
  file: File,
): Promise<{ path: string; url: string }> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${FOLDER}/${timestamp}_${safeName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  return { path, url: getPublicUrl(supabase, path) };
}

export async function listMedia(supabase: SupabaseClient): Promise<MediaItem[]> {
  const { data, error } = await supabase.storage.from(BUCKET).list(FOLDER, {
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) throw error;
  if (!data) return [];

  return data
    .filter((f) => f.name !== ".emptyFolderPlaceholder")
    .map((f) => {
      const path = `${FOLDER}/${f.name}`;
      return {
        name: f.name,
        path,
        url: getPublicUrl(supabase, path),
        size: f.metadata?.size ?? 0,
        created_at: f.created_at ?? "",
      };
    });
}

export async function deleteMedia(
  supabase: SupabaseClient,
  path: string,
): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}
