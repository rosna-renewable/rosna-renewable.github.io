import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database, Tables } from '../../../database.types'

const supabaseUrl = "https://oqljqxwlvdbuyrtdhpbg.supabase.co"
const supabasePublishable = "sb_publishable_5QQKewZ-R5i4i3Qy9LS6dA_fQ0zworE"
export const client: SupabaseClient<Database> = createClient(supabaseUrl, supabasePublishable)
export type Solar = Tables<'solar'>;
