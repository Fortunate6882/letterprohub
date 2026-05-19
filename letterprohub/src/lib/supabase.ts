import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'letterhub-auth',
    storage: window.localStorage,
    autoRefreshToken: true,
  }
})

export type Profile = {
  id: string
  username: string
  full_name: string
  email: string
  phone: string
  country: string
  referral_code: string
  balance: number
  bonus: number
  kyc_status: string
  letters_completed: number
  created_at: string
}

export type Letter = {
  id: string
  user_id: string
  title: string
  content: string
  status: string
  payment_amount: number
  created_at: string
}

export type Withdrawal = {
  id: string
  user_id: string
  amount: number
  payment_method: string | null
  payment_details: Record<string, string> | null
  wallet_type: string | null
  wallet_address: string | null
  btc_address: string | null
  swift_code: string | null
  status: string
  created_at: string
}

export type KycSubmission = {
  id: string
  user_id: string
  document_type: string
  front_url: string
  back_url: string
  status: string
  created_at: string
}
