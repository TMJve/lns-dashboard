// /lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // stays the same
  process.env.SUPABASE_SERVICE_ROLE_KEY! // full access key, ONLY server side
);
