import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useVehicleOptions() {
 return useQuery({
  queryKey: ['vehicle-options'],
  queryFn: async ({ signal }) => {
   const { data, error } = await supabase.from('vehicle_makes').select('id, name, vehicle_models(id, name)').order('name').abortSignal(signal)
   if (error) throw new Error('Unable to load vehicles. Please try again.')
   return data.map(make => ({ ...make, vehicle_models: [...make.vehicle_models].sort((a,b) => a.name.localeCompare(b.name)) }))
  },
  staleTime: 60000,
  retry: 1,
 })
}
