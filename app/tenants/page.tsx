import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: tenants } = await supabase.from('tenants').select()

  return <pre>{JSON.stringify(tenants, null, 2)}</pre>
}