import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  kyc_status: 'not_submitted' | 'pending' | 'verified' | 'rejected'
  letters_completed: number
  created_at: string
}

export type Letter = {
  id: string
  user_id: string
  title: string
  content: string
  payment_amount: number
  status: 'assigned' | 'submitted' | 'approved' | 'paid' | 'rejected'
  created_at: string
}

export type Withdrawal = {
  id: string
  user_id: string
  amount: number
  btc_address: string
  swift_code: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export type KycSubmission = {
  id: string
  user_id: string
  document_type: string
  front_url: string
  back_url: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}
