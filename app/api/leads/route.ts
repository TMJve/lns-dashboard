// app/api/leads/route.ts

export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // only used server-side
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tenant_slug, first_name, email } = body;

    // 🔒 1. Optional: Require a secret header from n8n
    const secret = req.headers.get("x-api-key");
    if (secret !== process.env.INTERNAL_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔎 2. Get tenant_id based on tenant_slug
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("id")
      .eq("tenant_slug", tenant_slug)
      .single();

    if (tenantError || !tenant)
      return NextResponse.json({ error: "Invalid tenant" }, { status: 400 });

    // 🧩 3. Insert lead into your private.leads table
    const { data, error } = await supabase
      .from("leads")
      .insert({
        tenant_id: tenant.id,
        first_name,
        email,
        status: "New Lead",
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, lead_id: data.id });
  } catch (err) {
  console.error("Lead insert error:", err);

  if (err instanceof Error) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ error: "Unknown error" }, { status: 500 });
}
}
