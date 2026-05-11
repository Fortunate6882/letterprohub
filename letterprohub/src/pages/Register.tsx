import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Gift } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Logo } from '../components/Navbar'

const countries = ["Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh","Belgium","Brazil","Canada","Chile","China","Colombia","Croatia","Czech Republic","Denmark","Egypt","Ethiopia","Finland","France","Germany","Ghana","Greece","Hungary","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Japan","Jordan","Kenya","Malaysia","Mexico","Morocco","Netherlands","New Zealand","Nigeria","Norway","Pakistan","Peru","Philippines","Poland","Portugal","Romania","Russia","Saudi Arabia","Singapore","South Africa","South Korea","Spain","Sri Lanka","Sweden","Switzerland","Tanzania","Thailand","Tunisia","Turkey","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Vietnam","Zimbabwe"]

const Register = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    username: '', fullName: '', email: '', phone: '',
    password: '', confirmPassword: '', country: '', referralCode: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.username || !form.fullName || !form.email || !form.phone || !form.password || !form.country) {
      setError('Please fill in all required fields.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            username: form.username,
            full_name: form.fullName,
            phone: form.phone,
            country: form.country,
            referral_code: form.referralCode || '',
          }
        }
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered') || signUpError.message.includes('already exists')) {
          setError('This email is already registered. Please sign in.')
        } else {
          setError(signUpError.message)
        }
        return
      }

      if (data.user) {
        navigate('/dashboard')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-navy-900 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <Logo white />
          </div>

          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 flex items-center gap-3 mb-6">
            <Gift size={18} className="text-green-400 flex-shrink-0" />
            <p className="text-green-300 text-sm font-body font-semibold">
              Get a <span className="text-green-400">$15 welcome bonus</span> when you sign up!
            </p>
          </div>

          <h2 className="text-2xl font-heading font-bold text-white mb-1">Create your Account</h2>
          <p className="text-white/60 text-sm font-body mb-6">Join thousands of writers earning daily</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl p-3 mb-4 text-sm font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Username', name: 'username', type: 'text', placeholder: 'Enter unique username' },
              { label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'Enter your full name' },
              { label: 'Email Address', name: 'email', type: 'email', placeholder: 'name@example.com' },
              { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: 'Enter your phone number' },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="text-white/80 text-xs font-body font-medium block mb-1">{label} *</label>
                <input
                  type={type}
                  name={name}
                  value={form[name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            ))}

            <div>
              <label className="text-white/80 text-xs font-body font-medium block mb-1">Country *</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="" className="bg-navy-900">Select your country</option>
                {countries.map(c => <option key={c} value={c} className="bg-navy-900">{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-white/80 text-xs font-body font-medium block mb-1">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  autoComplete="new-password"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 pr-12 text-sm font-body focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-white/50 hover:text-white">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-white/80 text-xs font-body font-medium block mb-1">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 pr-12 text-sm font-body focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3 text-white/50 hover:text-white">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-white/80 text-xs font-body font-medium block mb-1">Referral Code (optional)</label>
              <input
                type="text"
                name="referralCode"
                value={form.referralCode}
                onChange={handleChange}
                placeholder="Enter referral code if you have one"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-4 rounded-xl font-body font-semibold text-sm transition-colors mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-white/60 text-sm font-body mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
