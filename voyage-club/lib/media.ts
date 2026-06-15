const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");

function isAbsoluteUrl(value: string) {
  return /^(?:https?:)?\/\//.test(value) || value.startsWith("data:");
}

export function resolveStoragePublicUrl(path?: string | null) {
  if (!path) return null;
  if (isAbsoluteUrl(path) || path.startsWith("/")) return path;
  if (!supabaseUrl) return path;

  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `${supabaseUrl}/storage/v1/object/public/public-site-media/${encodedPath}`;
}
