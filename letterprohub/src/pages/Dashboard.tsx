import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { Home, FileText, History, User, LogOut, Eye, EyeOff, DollarSign, Gift, FileCheck, ArrowUpRight, Upload, ChevronDown, Copy, CheckCircle2, Wallet } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase, Letter, Withdrawal } from '../lib/supabase'
import { Logo } from '../components/Navbar'

const BTC_ADDRESS = 'bc1qy3n22f3cxklakcua0mek4x0k5a9qyn2j6qmal8kqlee6583gvajs3zqmys'

const KycBadge = ({ status }: { status: string }) => {
  const config = {
    not_submitted: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: '🔴 KYC Not Submitted' },
    pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: '🟡 KYC Pending' },
    verified: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: '🟢 KYC Verified' },
    rejected: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: '🔴 KYC Rejected' },
  }
  const c = config[status as keyof typeof config] || config.not_submitted
  return (
    <Link to="/dashboard/kyc">
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-body font-medium border ${c.color}`}>
        {c.label}
      </span>
    </Link>
  )
}

const DashboardHome = () => {
  const { profile } = useAuth()
  const [showBalance, setShowBalance] = useState(true)

  if (!profile) return null

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-500 text-sm font-body">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h1 className="text-2xl font-heading font-bold text-navy-900 mt-1">Hello {profile.username} 👋</h1>
        <div className="mt-2">
          <KycBadge status={profile.kyc_status} />
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-navy-900 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-white/60 text-sm font-body">Account Balance</p>
          <button onClick={() => setShowBalance(!showBalance)} className="text-white/60 hover:text-white">
            {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
        <p className="text-3xl font-heading font-bold mb-1">
          {showBalance ? `$${Number(profile.balance).toFixed(2)}` : '••••••'}
        </p>
        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-body">Available for Withdrawal</span>
        <p className="text-white/40 text-xs font-body mt-2">Last updated: {new Date().toLocaleString()}</p>
        <div className="flex gap-3 mt-4">
          <Link to="/dashboard/deposit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-body font-medium text-center transition-colors flex items-center justify-center gap-1">
            <Wallet size={16} /> Deposit
          </Link>
          <Link to="/dashboard/withdraw" className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl text-sm font-body font-medium text-center transition-colors flex items-center justify-center gap-1">
            <ArrowUpRight size={16} /> Withdraw
          </Link>
        </div>
        <div className="w-full bg-white/20 rounded-full h-1 mt-4">
          <div className="bg-blue-400 h-1 rounded-full" style={{ width: '45%' }}></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-xs font-body">Total Earnings</p>
            <DollarSign size={16} className="text-green-500" />
          </div>
          <p className="text-xl font-heading font-bold text-navy-900">${Number(profile.balance).toFixed(2)}</p>
          <p className="text-green-500 text-xs font-body mt-1">All time</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-xs font-body">Bonus</p>
            <Gift size={16} className="text-yellow-500" />
          </div>
          <p className="text-xl font-heading font-bold text-navy-900">${Number(profile.bonus).toFixed(2)}</p>
          <p className="text-yellow-600 text-xs font-body mt-1">Welcome Bonus</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-xs font-body">Letters Done</p>
            <FileCheck size={16} className="text-blue-500" />
          </div>
          <p className="text-xl font-heading font-bold text-navy-900">{profile.letters_completed}</p>
          <p className="text-gray-400 text-xs font-body mt-1">All time</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-xs font-body">Withdrawals</p>
            <ArrowUpRight size={16} className="text-blue-500" />
          </div>
          <p className="text-xl font-heading font-bold text-navy-900">$0.00</p>
          <p className="text-gray-400 text-xs font-body mt-1">All time</p>
        </div>
      </div>
    </div>
  )
}

const DepositPage = () => {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [amount, setAmount] = useState('')

  const copyAddress = () => {
    navigator.clipboard.writeText(BTC_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!amount || !proofFile) {
      setError('Please enter amount and upload payment proof.')
      return
    }
    setLoading(true)
    try {
      const filePath = `${user?.id}/proof-${Date.now()}-${proofFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(filePath, proofFile)
      if (uploadError) throw uploadError
      const { error: insertError } = await supabase.from('deposits').insert({
        user_id: user?.id,
        amount: parseFloat(amount),
        proof_url: filePath,
        status: 'pending'
      })
      if (insertError) throw insertError
      setSuccess(true)
      setAmount('')
      setProofFile(null)
    } catch {
      setError('Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-2xl font-heading font-bold text-navy-900">Make a Deposit</h2>
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm font-body">
          ✅ Deposit submitted! Admin will confirm and update your balance shortly.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm font-body">{error}</div>
      )}
      <div className="bg-navy-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Wallet size={20} className="text-blue-400" />
          <p className="font-body font-semibold">Wallet Address</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 mb-3">
          <p className="text-xs font-body text-white/60 mb-1">Send payment to this address:</p>
          <p className="text-white text-xs font-body break-all leading-relaxed">{BTC_ADDRESS}</p>
        </div>
        <button
          onClick={copyAddress}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-body font-semibold transition-colors w-full justify-center"
        >
          {copied ? <><CheckCircle2 size={16} /> Copied!</> : <><Copy size={16} /> Copy Address</>}
        </button>
        <div className="mt-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3">
          <p className="text-yellow-300 text-xs font-body leading-relaxed">
            ⚠️ Send payment to the address above then fill the form below and upload your payment proof. Your balance will be updated after confirmation.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div>
          <label className="text-gray-700 text-sm font-body font-medium block mb-1">Amount Sent ($)</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter amount you sent"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-gray-700 text-sm font-body font-medium block mb-1">Upload Payment Proof</label>
          <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-400 transition-colors">
            <Upload size={24} className="text-gray-400" />
            <span className="text-sm font-body text-gray-500">
              {proofFile ? proofFile.name : 'Click to upload screenshot/receipt'}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={e => setProofFile(e.target.files?.[0] || null)} />
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-body font-semibold text-sm transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Deposit'}
        </button>
      </form>
    </div>
  )
}

const LettersPage = () => {
  const { user } = useAuth()
  const [letters, setLetters] = useState<Letter[]>([])
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [content, setContent] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (user) {
      supabase.from('letters').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setLetters(data) })
    }
  }, [user])

  const submitLetter = async (letterId: string) => {
    if (!content[letterId]) return
    setSubmitting(letterId)
    await supabase.from('letters').update({ content: content[letterId], status: 'submitted' }).eq('id', letterId)
    setLetters(prev => prev.map(l => l.id === letterId ? { ...l, status: 'submitted', content: content[letterId] } : l))
    setSubmitting(null)
  }

  const statusColors: Record<string, string> = {
    assigned: 'bg-blue-100 text-blue-700',
    submitted: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    paid: 'bg-purple-100 text-purple-700',
    rejected: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-bold text-navy-900">My Letters</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-blue-700 text-sm font-body">Your letter topics are assigned by our team via WhatsApp. Once you complete a letter, paste it below and submit.</p>
      </div>
      {letters.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <FileText size={40} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-body">No letters assigned yet. Check your WhatsApp!</p>
        </div>
      ) : (
        letters.map(letter => (
          <div key={letter.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading font-bold text-navy-900">{letter.title}</h3>
                <p className="text-gray-500 text-xs font-body mt-1">{new Date(letter.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                {letter.payment_amount > 0 && (
                  <span className="text-green-600 font-body font-semibold text-sm">${letter.payment_amount}</span>
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-body font-medium ${statusColors[letter.status]}`}>
                  {letter.status.charAt(0).toUpperCase() + letter.status.slice(1)}
                </span>
              </div>
            </div>
            {letter.status === 'assigned' && (
              <div className="space-y-3">
                <textarea
                  value={content[letter.id] || ''}
                  onChange={e => setContent(prev => ({ ...prev, [letter.id]: e.target.value }))}
                  placeholder="Paste your completed letter here..."
                  rows={6}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm font-body focus:outline-none focus:border-blue-500 resize-none"
                />
                <button
                  onClick={() => submitLetter(letter.id)}
                  disabled={submitting === letter.id || !content[letter.id]}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl text-sm font-body font-semibold transition-colors"
                >
                  {submitting === letter.id ? 'Submitting...' : 'Submit Letter'}
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

const WithdrawPage = () => {
  const { profile, refreshProfile } = useAuth()
  const { user } = useAuth()
  const [form, setForm] = useState({ amount: '', btcAddress: '', swiftCode: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.amount || !form.btcAddress || !form.swiftCode) {
      setError('Please fill all fields.')
      return
    }
    const amount = parseFloat(form.amount)
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount.')
      return
    }
    if (profile && amount > profile.balance) {
      setError('Insufficient balance.')
      return
    }
    if (form.swiftCode.length < 4) {
      setError('Invalid Swift Code.')
      return
    }
    setLoading(true)
    const { error: err } = await supabase.from('withdrawals').insert({
      user_id: user?.id,
      amount,
      btc_address: form.btcAddress,
      swift_code: form.swiftCode,
      status: 'pending'
    })
    setLoading(false)
    if (err) { setError('Failed to submit. Please try again.'); return }
    setSuccess(true)
    setForm({ amount: '', btcAddress: '', swiftCode: '' })
    refreshProfile()
  }

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-2xl font-heading font-bold text-navy-900">Request Withdrawal</h2>
      <div className="bg-navy-900 rounded-2xl p-4 text-white">
        <p className="text-white/60 text-sm font-body">Available Balance</p>
        <p className="text-2xl font-heading font-bold">${Number(profile?.balance || 0).toFixed(2)}</p>
      </div>
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm font-body">
          Withdrawal request submitted! Admin will review shortly.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm font-body">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div>
          <label className="text-gray-700 text-sm font-body font-medium block mb-1">Amount ($)</label>
          <input
            type="number"
            value={form.amount}
            onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
            placeholder="Enter withdrawal amount"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-gray-700 text-sm font-body font-medium block mb-1">Wallet Address</label>
          <input
            type="text"
            value={form.btcAddress}
            onChange={e => setForm(p => ({ ...p, btcAddress: e.target.value }))}
            placeholder="Enter your wallet address"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-gray-700 text-sm font-body font-medium block mb-1">Swift Code</label>
          <input
            type="text"
            value={form.swiftCode}
            onChange={e => setForm(p => ({ ...p, swiftCode: e.target.value }))}
            placeholder="Enter Swift Code"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-body font-semibold text-sm transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  )
}

const KycPage = () => {
  const { profile, user, refreshProfile } = useAuth()
  const [docType, setDocType] = useState('')
  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (profile?.kyc_status === 'pending') {
    return (
      <div className="max-w-lg space-y-6">
        <h2 className="text-2xl font-heading font-bold text-navy-900">KYC Verification</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <p className="text-yellow-800 font-body leading-relaxed">
            Your KYC documents have been successfully submitted and are currently under review. Our compliance team will verify your identity within 24-48 hours. You will receive an email notification once your verification is complete.
          </p>
        </div>
      </div>
    )
  }

  if (profile?.kyc_status === 'verified') {
    return (
      <div className="max-w-lg space-y-6">
        <h2 className="text-2xl font-heading font-bold text-navy-900">KYC Verification</h2>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <p className="text-green-800 font-body font-semibold">✅ Your identity has been verified!</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!docType || !frontFile || !backFile) {
      setError('Please select document type and upload both front and back.')
      return
    }
    setLoading(true)
    try {
      const uploadFile = async (file: File, path: string) => {
        const { data, error } = await supabase.storage.from('kyc-documents').upload(path, file)
        if (error) throw error
        return data.path
      }
      const frontPath = await uploadFile(frontFile, `${user?.id}/front-${Date.now()}`)
      const backPath = await uploadFile(backFile, `${user?.id}/back-${Date.now()}`)
      await supabase.from('kyc_submissions').insert({
        user_id: user?.id,
        document_type: docType,
        front_url: frontPath,
        back_url: backPath,
        status: 'pending'
      })
      await supabase.from('profiles').update({ kyc_status: 'pending' }).eq('id', user?.id)
      setSuccess(true)
      refreshProfile()
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h2 className="text-2xl font-heading font-bold text-navy-900">KYC Verification</h2>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm font-body">{error}</div>}
      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <p className="text-green-800 font-body leading-relaxed">
            Your KYC documents have been successfully submitted and are currently under review. Our compliance team will verify your identity within 24-48 hours. You will receive an email notification once your verification is complete.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div>
            <label className="text-gray-700 text-sm font-body font-medium block mb-1">Document Type</label>
            <div className="relative">
              <select
                value={docType}
                onChange={e => setDocType(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500 appearance-none"
              >
                <option value="">Select document type</option>
                <option value="national_id">National ID</option>
                <option value="drivers_license">Driver's License</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          {docType && (
            <>
              <div>
                <label className="text-gray-700 text-sm font-body font-medium block mb-1">Front of Document</label>
                <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-400 transition-colors">
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-sm font-body text-gray-500">{frontFile ? frontFile.name : 'Click to upload front'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => setFrontFile(e.target.files?.[0] || null)} />
                </label>
              </div>
              <div>
                <label className="text-gray-700 text-sm font-body font-medium block mb-1">Back of Document</label>
                <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-400 transition-colors">
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-sm font-body text-gray-500">{backFile ? backFile.name : 'Click to upload back'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => setBackFile(e.target.files?.[0] || null)} />
                </label>
              </div>
            </>
          )}
          <button
            type="submit"
            disabled={loading || !docType}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-body font-semibold text-sm transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit KYC'}
          </button>
        </form>
      )}
    </div>
  )
}

const HistoryPage = () => {
  const { user } = useAuth()
  const [tab, setTab] = useState<'earnings' | 'withdrawals' | 'deposits'>('earnings')
  const [letters, setLetters] = useState<Letter[]>([])
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [deposits, setDeposits] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      supabase.from('letters').select('*').eq('user_id', user.id).in('status', ['approved', 'paid']).order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setLetters(data) })
      supabase.from('withdrawals').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setWithdrawals(data) })
      supabase.from('deposits').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setDeposits(data) })
    }
  }, [user])

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    paid: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-bold text-navy-900">History</h2>
      <div className="flex gap-2 bg-gray-100 rounded-xl p-1 w-fit">
        {(['earnings', 'deposits', 'withdrawals'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors capitalize ${tab === t ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-500'}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {tab === 'earnings' ? (
          letters.length === 0 ? <p className="text-gray-500 font-body text-sm">No earnings yet.</p> :
          letters.map(l => (
            <div key={l.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-body font-medium text-navy-900 text-sm">{l.title}</p>
                <p className="text-gray-400 text-xs font-body">{new Date(l.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-green-600 font-heading font-bold">${l.payment_amount}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-body ${statusColors[l.status]}`}>{l.status}</span>
              </div>
            </div>
          ))
        ) : tab === 'deposits' ? (
          deposits.length === 0 ? <p className="text-gray-500 font-body text-sm">No deposits yet.</p> :
          deposits.map(d => (
            <div key={d.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-body font-medium text-navy-900 text-sm">Deposit</p>
                <p className="text-gray-400 text-xs font-body">{new Date(d.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-navy-900 font-heading font-bold">${d.amount}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-body ${statusColors[d.status]}`}>{d.status}</span>
              </div>
            </div>
          ))
        ) : (
          withdrawals.length === 0 ? <p className="text-gray-500 font-body text-sm">No withdrawals yet.</p> :
          withdrawals.map(w => (
            <div key={w.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-body font-medium text-navy-900 text-sm">Withdrawal Request</p>
                <p className="text-gray-400 text-xs font-body">{new Date(w.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-navy-900 font-heading font-bold">${w.amount}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-body ${statusColors[w.status]}`}>{w.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const ProfilePage = () => {
  const { profile } = useAuth()
  if (!profile) return null
  return (
    <div className="max-w-lg space-y-6">
      <h2 className="text-2xl font-heading font-bold text-navy-900">My Profile</h2>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-heading font-bold">
            {profile.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-heading font-bold text-navy-900 text-lg">{profile.full_name}</p>
            <p className="text-gray-500 text-sm font-body">@{profile.username}</p>
            <KycBadge status={profile.kyc_status} />
          </div>
        </div>
        {[
          ['Username', profile.username],
          ['Full Name', profile.full_name],
          ['Email', profile.email],
          ['Phone', profile.phone],
          ['Country', profile.country],
          ['Member Since', new Date(profile.created_at).toLocaleDateString()],
          ['Account Balance', `$${Number(profile.balance).toFixed(2)}`],
          ['Welcome Bonus', `$${Number(profile.bonus).toFixed(2)}`],
          ['Letters Completed', String(profile.letters_completed)],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-gray-500 text-sm font-body">{label}</span>
            <span className="text-navy-900 text-sm font-body font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const navItems = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/dashboard/letters', label: 'Letters', icon: FileText },
  { to: '/dashboard/history', label: 'History', icon: History },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
]

const Dashboard = () => {
  const { profile, signOut } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = '//code.jivosite.com/widget/v0PDhrV1WU'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
      const jivo = document.getElementById('jivo-iframe-container')
      if (jivo) jivo.remove()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy-900 fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4">
        <Logo white />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-heading font-bold">
            {profile?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <button onClick={signOut} className="flex items-center gap-1 text-white/60 hover:text-white text-sm font-body transition-colors">
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="pt-16 pb-20 px-4 max-w-2xl mx-auto">
        <div className="py-6">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="deposit" element={<DepositPage />} />
            <Route path="letters" element={<LettersPage />} />
            <Route path="withdraw" element={<WithdrawPage />} />
            <Route path="kyc" element={<KycPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 flex justify-around z-50">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))
          return (
            <Link key={to} to={to} className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${active ? 'text-blue-600' : 'text-gray-400'}`}>
              <Icon size={20} />
              <span className="text-xs font-body">{label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default Dashboard

