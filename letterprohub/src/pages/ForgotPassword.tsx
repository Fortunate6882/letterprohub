import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Please enter your email.'); return }
    setLoading(true)
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: 'https://letterhubproio.com/reset-password',
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setSent(true)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560472355-536de3962603?w=1920&h=1080&fit=crop')" }}/>
      <div className="absolute inset-0 bg-navy-900/88"/>
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-heading font-bold text-navy-900 text-lg">LetterPro<span className="text-blue-600">Hub</span></span>
            </div>
          </div>
          <h2 className="text-2xl font-heading font-bold text-navy-900 mb-1">Forgot Password</h2>
          <p className="text-gray-500 text-sm font-body mb-6">Enter your email and we'll send you a reset link</p>
          {sent ? (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm font-body text-center">
              ✅ Reset link sent! Check your email inbox and click the link to reset your password.
            </div>
          ) : (
            <>
              {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm font-body">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-gray-700 text-xs font-body font-bold block mb-1">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com" autoComplete="email"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500"/>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-body font-bold text-sm transition-colors">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
          <p className="text-center text-gray-500 text-sm font-body mt-4">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
