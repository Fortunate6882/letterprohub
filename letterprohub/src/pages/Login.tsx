import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Logo } from '../components/Navbar'

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(prev => ({ ...prev, [e.target.name]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (signInError) {
        setError('Invalid email or password. Please try again.')
        return
      }
      if (data.user) {
        navigate('/dashboard')
      }
    } catch {
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

          <h2 className="text-2xl font-heading font-bold text-white mb-1">Welcome Back</h2>
          <p className="text-white/60 text-sm font-body mb-6">Sign in to your affiliate dashboard</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl p-3 mb-4 text-sm font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/80 text-xs font-body font-medium block mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                autoComplete="email"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-white/80 text-xs font-body font-medium block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 pr-12 text-sm font-body focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-white/50 hover:text-white">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-600"
                />
                <span className="text-white/60 text-sm font-body">Remember me</span>
              </label>
              <span className="text-blue-400/60 text-sm font-body cursor-not-allowed">Forgot password?</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-4 rounded-xl font-body font-semibold text-sm transition-colors"
            >
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 mt-4 text-green-400/80 text-xs font-body">
            <ShieldCheck size={14} />
            <span>Secured by SSL</span>
          </div>

          <p className="text-center text-white/60 text-sm font-body mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
