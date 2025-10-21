// app/api/leads/route.ts

export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ✅ Initialize Supabase (server-side key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ never expose this client-side
);

export async function POST(req: Request) {
  console.log("🔥 Incoming request to /api/leads");

  try {
    // Parse body
    const body = await req.json();
    console.log("🧩 Parsed body:", body);

    const { tenant_slug, first_name, email } = body;

    // 🛡️ Check API key
    const secret = req.headers.get("x-api-key");
    console.log("🔐 Received x-api-key:", secret);

    if (secret !== process.env.INTERNAL_API_KEY) {
      console.error("❌ Unauthorized request: invalid INTERNAL_API_KEY");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔎 Get tenant_id based on tenant_slug
    console.log("🔍 Looking up tenant with slug:", tenant_slug);
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("id")
      .eq("tenant_slug", tenant_slug)
      .single();

    if (tenantError) {
      console.error("❌ Tenant lookup error:", tenantError);
      return NextResponse.json({ error: tenantError.message }, { status: 400 });
    }

    if (!tenant) {
      console.error("❌ No tenant found for slug:", tenant_slug);
      return NextResponse.json({ error: "Invalid tenant" }, { status: 400 });
    }

    console.log("✅ Tenant found:", tenant.id);

    // 🧩 Insert lead into your leads table
    console.log("🪄 Inserting new lead:", { first_name, email });
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

    if (error) {
      console.error("💥 Lead insert error:", error);
      throw error;
    }

    console.log("🎉 Lead inserted successfully with ID:", data.id);

    return NextResponse.json({ success: true, lead_id: data.id }, { status: 200 });
  } catch (err) {
    console.error("🔥 Unexpected error in /api/leads:", err);

    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
