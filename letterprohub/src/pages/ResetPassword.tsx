import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type')

    if (tokenHash && type === 'recovery') {
      supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' })
        .then(({ error }) => {
          if (error) {
            setError('Invalid or expired reset link. Please request a new one.')
          }
          setVerifying(false)
        })
    } else {
      setError('Invalid reset link. Please request a new one.')
      setVerifying(false)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) { setError(err.message); return }
    setSuccess(true)
    setTimeout(() => navigate('/login'), 3000)
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
          <h2 className="text-2xl font-heading font-bold text-navy-900 mb-1">Set New Password</h2>
          <p className="text-gray-500 text-sm font-body mb-6">Enter your new password below</p>

          {verifying ? (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 text-sm font-body mt-2">Verifying reset link...</p>
            </div>
          ) : success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm font-body text-center">
              ✅ Password updated successfully! Redirecting to login...
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm font-body">{error}</div>
              <button onClick={() => navigate('/forgot-password')}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-body font-bold text-sm">
                Request New Reset Link
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-700 text-xs font-body font-bold block mb-1">New Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500"/>
              </div>
              <div>
                <label className="text-gray-700 text-xs font-body font-bold block mb-1">Confirm Password</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500"/>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-body font-bold text-sm transition-colors">
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
