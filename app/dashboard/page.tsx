import { createClient } from '@/lib/supabase/server'

// Defines the "shape" of a lead for TypeScript.
type Lead = {
  id: string;
  first_name: string;
  email: string;
  status: string;
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // This will now work. The database knows where to find the function.
  const { data: leads, error } = await supabase.rpc('get_all_leads_for_test')

  if (error) {
    console.error('Supabase RPC Error:', error)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Your Leads</h1>
      <div className="border rounded-lg">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y">
            {leads?.map((lead: Lead) => (
              <tr key={lead.id}>
                <td className="px-6 py-4 whitespace-nowrap">{lead.first_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lead.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {lead.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}