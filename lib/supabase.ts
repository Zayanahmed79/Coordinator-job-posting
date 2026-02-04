import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

export type JobListing = {
  id: string
  title: string
  description: string
  location: string
  company: string
  apply_link: string
  type: string
  created_at: string
}
