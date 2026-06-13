import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseServerClient, createSupabaseServiceClient } from "./supabase/server";

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function isCurrentUserAdmin() {
  const user = await getCurrentUser();
  if (!user) return false;

  const service = createSupabaseServiceClient();
  if (!service) return false;

  const { data, error } = await service
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return !error && Boolean(data);
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin?login=required");

  const service = createSupabaseServiceClient();
  if (!service) redirect("/admin?setup=required");

  const { data } = await service
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) redirect("/admin?denied=1");
  return { user, service };
}

